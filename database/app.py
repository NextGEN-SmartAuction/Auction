from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = "C:\\Users\\Vishnu\\Documents\\Gitprojects\\Auction\\database"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Manually set CORS headers
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'  # Allow your React app's origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'  # Allowed HTTP methods
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'  # Allowed request headers
    response.headers['Access-Control-Allow-Credentials'] = 'true'  # Allow credentials
    return response

# Handle pre-flight requests (OPTIONS)
@app.route('/upload', methods=['OPTIONS'])
def options_request():
    response = jsonify({'message': 'Pre-flight request allowed'})
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
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
        primary_path = os.path.join(app.config['UPLOAD_FOLDER'], "products",filename)
        primary_image.save(primary_path)
        saved_files.append(filename)

    # Handle other images
    other_images = [file for key, file in request.files.items() if key.startswith('otherImages')]
    for index, image in enumerate(other_images, start=1):
        if image and allowed_file(image.filename):
            filename = f"{product_id}_S{index}.{secure_filename(image.filename).rsplit('.', 1)[1]}"
            image_path = os.path.join(app.config['UPLOAD_FOLDER'],"products", filename)
            image.save(image_path)
            saved_files.append(filename)

    # Save product data into your database here (if applicable)

    return jsonify({'message': 'Images uploaded successfully', 'files': saved_files}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Make sure Flask is running on port 5001
