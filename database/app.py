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
    foldername = request.form.get('foldername', 'default')  # Default to 'default' if not provided
    username = request.form.get('username', 'default')  # Default to 'default' if not provided
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], username,foldername)
    
    # Create the folder if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Validate file extension
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(folder_path, filename))  # Save the file to the folder
        return jsonify({'message': 'File successfully uploaded', 'filename': filename}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Make sure Flask is running on port 5001
