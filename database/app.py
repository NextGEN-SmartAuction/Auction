from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Use environment variables with the 'REACT_APP_' prefix
UPLOAD_FOLDER = os.getenv('REACT_APP_UPLOAD_FOLDER', 'default_upload_path')  # Default to 'default_upload_path' if not set
ALLOWED_EXTENSIONS = os.getenv('REACT_APP_ALLOWED_EXTENSIONS', 'png,jpg,jpeg,gif').split(',')
REACT_APP_URL = os.getenv('REACT_APP_URL', 'http://localhost:3000')  # Default to 'http://localhost:3000'
PORT = int(os.getenv('REACT_APP_PORT', 5001))  # Default to 5001 if not set

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Manually set CORS headers
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = REACT_APP_URL  # Use React app's URL from the .env file
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'  # Allowed HTTP methods
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'  # Allowed request headers
    response.headers['Access-Control-Allow-Credentials'] = 'true'  # Allow credentials
    return response

# Handle pre-flight requests (OPTIONS)
@app.route('/upload', methods=['OPTIONS'])
def options_request():
    response = jsonify({'message': 'Pre-flight request allowed'})
    response.headers['Access-Control-Allow-Origin'] = REACT_APP_URL  # Use React app's URL from the .env file
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response, 200

# Endpoint to handle image upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Get folder name and check if valid
    username = request.form.get('username', 'default')  # Default to 'default' if not provided
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], "logos")
    
    # Create the folder if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Validate file extension
    if file and allowed_file(file.filename):
        # Get the file extension
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        
        # Create a new filename using the username and original file extension
        new_filename = f"{username}.{file_extension}"
        
        # Save the file with the new filename
        file.save(os.path.join(folder_path, new_filename))
        
        return jsonify({'message': 'File successfully uploaded', 'filename': new_filename}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400
    
@app.route('/uploadProductImages', methods=['POST'])
def upload_product_images():
    if 'productData' not in request.form:
        return jsonify({'error': 'Product data missing'}), 400

    product_data = request.form['productData']
    product_data = eval(product_data)  # Convert string to dictionary
    product_id = product_data.get('productId')

    if not product_id:
        return jsonify({'error': 'Product ID is missing'}), 400

    saved_files = []

    # Handle primary image
    primary_image = request.files.get('primaryImage')
    if primary_image and allowed_file(primary_image.filename):
        filename = f"{product_id}_P.{secure_filename(primary_image.filename).rsplit('.', 1)[1]}"
        primary_path = os.path.join(app.config['UPLOAD_FOLDER'], "products", filename)
        primary_image.save(primary_path)
        saved_files.append(filename)

    # Handle other images
    other_images = [file for key, file in request.files.items() if key.startswith('otherImages')]
    for index, image in enumerate(other_images, start=1):
        if image and allowed_file(image.filename):
            filename = f"{product_id}_S{index}.{secure_filename(image.filename).rsplit('.', 1)[1]}"
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], "products", filename)
            image.save(image_path)
            saved_files.append(filename)

    # Save product data into your database here (if applicable)

    return jsonify({'message': 'Images uploaded successfully', 'files': saved_files}), 200


@app.route('/get-product-images/<product_id>', methods=['GET'])
def get_product_images(product_id):
    image_folder = os.path.join(UPLOAD_FOLDER, "products")  # Replace with the actual path to your images folder
    images = [
        img for img in os.listdir(image_folder) if img.startswith(product_id)
    ]
    if not images:
        return jsonify({"success": False, "message": "No images found for the product"}), 404
    return jsonify({"success": True, "images": images}), 200

if __name__ == '__main__':
    app.run(debug=True, port=PORT)  # Use port from .env file
