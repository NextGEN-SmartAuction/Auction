from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from selenium import webdriver
import time
import joblib
from barcode import Code128
from barcode.writer import ImageWriter
from datetime import datetime
from PIL import Image
import hashlib
import pdfkit
import pandas as pd
import numpy as np
# Ensure the static folder exists for saving PDFs
STATIC_FOLDER = "static"
if not os.path.exists(STATIC_FOLDER):
    os.makedirs(STATIC_FOLDER)

np.set_printoptions(precision = 4)

import matplotlib.pyplot as plt
# %matplotlib inline
# import seaborn as sns
# sns.set_theme(style = 'white', palette = 'colorblind')

from scipy import sparse
from numpy import count_nonzero

# import imblearn
# from imblearn.over_sampling import SMOTE

import sklearn.preprocessing as preproc
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report, precision_recall_curve, auc
# import cPickle
# Reading the dataset


import joblib

from dotenv import load_dotenv
load_dotenv()

# Training the model on the training set (not scaled or resampled dataset)
classifier_rfc = RandomForestClassifier(criterion = 'entropy', random_state = 42)
app = Flask(__name__)
loaded_rf = joblib.load("C:\\Users\\Vishnu\\Documents\\Gitprojects\\Auction\\database\\my_random_forest.joblib")

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
    
    
@app.route('/complete-auction', methods=['POST'])
def complete_auction():
    try:
        # Step 1: Get the request data
        data = request.get_json()
        auction_data = data.get('auctionData')

        if not auction_data :
            return jsonify({'message': 'Auction data required'}), 400

        # Step 2: Process auction data to predict class using the loaded model
        predictions = []

        # Iterate through auction_data and prepare features for prediction
        for auction in auction_data:
            min_value = auction['min_bids']
            max_value = auction['max_bids']
            mid_value = auction['auction_bids']
            current_price =auction['current_starting_price']
            min_price =auction['min_starting_price']
            max_price =auction['max_starting_price']
            if max_value == min_value:
                max_value = max_value+1
            if max_price == min_price:
                max_price = max_price+1
                
            if mid_value<min_value:
                mid_value = min_value
            
            auction_start_price= (current_price - min_price)/(max_price-min_price)
            if auction_start_price>0.5 :
                auction_start_price = 0.99879
            else :
                auction_start_price = 0
       
            
            auction_bid = (mid_value - min_value)/(max_value-min_value)            
            single_input = [
                auction['bidder_tendency'],
                auction['bidding_ratio'],
                auction['successive_outbidding'],
                auction['last_bidding'],
                auction_bid,
                auction_start_price,
                auction['early_bidding'],
                auction['winning_ratio'],
                auction['auction_duration'] // 3600  # Convert seconds to hours
            ]

            # Convert to DataFrame as expected by the model
            single_input_df = pd.DataFrame([single_input], columns=[
                'Bidder_Tendency', 'Bidding_Ratio', 'Successive_Outbidding',
                'Last_Bidding', 'Auction_Bids', 'Starting_Price_Average',
                'Early_Bidding', 'Winning_Ratio', 'Auction_Duration'
            ])

            # Predict the class for this input
            y_pred_rfc = loaded_rf.predict(single_input_df)

            # Append the prediction result (convert to native int)
            predictions.append(int(y_pred_rfc[0]))
            
        # Check the sum of predictions to determine auction status
        if sum(predictions) == 0:
            shill_status = "not happend"
        else:
            shill_status = "happend"

        # Step 3: Return the response with predictions
        return jsonify({
            'message': 'Auction completed successfully',
            'predictions': predictions ,
            'shill_status': shill_status
        }), 200

    except Exception as e:
        print(f"Error completing auction: {e}")
        return jsonify({'message': 'Failed to complete auction', 'error': str(e)}), 500


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




@app.route('/generateCertificate', methods=['POST'])
def generateCertificate():
    try:
        # Step 1: Get product data from the request
        product_data = request.get_json()
        
        # Step 2: Extract values from the received JSON
        product_id = product_data.get("productId")
        product_name = product_data.get("productName")
        seller_id = product_data.get("sellerId")
        seller_name = product_data.get("sellerName")
        bidder_id = product_data.get("bidderId")
        bidder_name = product_data.get("bidderName")
        amount = product_data.get("amount")
        transaction_id = product_data.get("transactionId")
        ipfs_hash = product_data.get("ipfsHash")
        date = product_data.get("date")
        time = product_data.get("time")

       # Generate barcode and save in the static folder
        barcode_details = f"Bidder: {bidder_name}, Seller: {seller_name}, UPI ID: {transaction_id}"
        hashed_details = hashlib.sha256(barcode_details.encode('utf-8')).hexdigest()
        barcode_name = f"./static/barcode_image"
        barcode = Code128(hashed_details, writer=ImageWriter())
        barcode.save(barcode_name)

        # Make the barcode transparent
        transparent_barcode_name = f"./static/barcode_image_transparent.png"
        try:
            barcode_img = Image.open(f"{barcode_name}.png").convert("RGBA")
            barcode_img = barcode_img.resize((300, 100))  # Resize for certificate
            datas = barcode_img.getdata()
            new_data = [(255, 255, 255, 0) if item[:3] == (255, 255, 255) else item for item in datas]
            barcode_img.putdata(new_data)
            barcode_img.save(transparent_barcode_name, "PNG")
        except Exception as e:
            print(f"Error processing barcode: {e}")
            transparent_barcode_name = f"{barcode_name}.png"  # Fallback
        # Step 3: Generate HTML certificate
          # Step 3: Generate HTML certificate
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sales Certificate</title>
            <style>
                body {{
                    font-family: 'Georgia', serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f3f4f6;
                    color: #333;
                }}
                .certificate-header img.logo {{
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    }}
                .certificate {{
                    width: 210mm;
                    height: 297mm;
                    margin: auto;
                    padding: 30px;
                    background: linear-gradient(to bottom, #ffffff, #f7f9fc);
                    border: 12px double #020202;
                    border-radius: 10px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }}
                .watermark {{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 90px;
                    color: rgba(26, 115, 232, 0.1);
                }}
                .certificate-header {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .certificate-header img {{
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                }}
                .certificate-header h1 {{
                    font-size: 36px;
                    text-transform: uppercase;
                    font-weight: bold;
                }}
                .content {{
                    font-size: 16px;
                    line-height: 1.8;
                    text-align: justify;
                }}
                .details {{
                    margin: 20px 0;
                    padding: 15px;
                    border: 2px solid black;
                    background-color: #eef4ff;
                    font-size: 16px;
                }}
                .footer {{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }}
                .footer img {{
                    width: 200px;
                }}
                .certificate-footer {{
                    text-align: center;
                    font-size: 12px;
                    color: #555;
                }}
                @media print {{
                    body {{
                        background-color: #fff;
                    }}
                    .certificate {{
                        border: 10px solid black;
                        box-shadow: none;
                        margin: 0;
                        padding: 20px;
                        page-break-after: avoid;
                        width: 210mm;
                        height: 297mm;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="certificate">
                <div class="watermark">NEXTGEN AUCTION</div>
                <div class="certificate-header">
                    <img src="https://thumbs.dreamstime.com/b/verified-stamp-seal-vector-illustration-rubber-simple-isolated-white-background-158487628.jpg" alt="Logo" class="logo">
                    <h1><u> Sales Certificate</u></h1>
                    <h2>Issued by NextGen Auction</h2>
                </div>
                <div class="content">
                    <p>
                        This is to certify that <strong>NextGen Auction</strong>, an authorized and reputed organization in conducting auctions, has successfully completed the sale of the listed item as per the guidelines and regulations. The auction was conducted in a fair and transparent manner, ensuring the highest standards of professionalism.
                    </p>
                    <p class="details">
                        On <strong>{date}</strong>, the product <strong>{product_name}</strong>, described as "(Brief Description of the Product)," was successfully auctioned to <strong>{bidder_name}</strong>. The auction, listed by <strong>{seller_name}</strong>, concluded with a final bid amount of <strong>${amount}</strong>, awarded at <strong>{time}</strong>.
                    </p>
                    <p>
                        The bidder, having satisfied all the necessary requirements and completed the bidding process, has been declared the winner. This certificate confirms the transfer of ownership rights of the above-mentioned product to the winning bidder.
                    </p>
                    <p>
                        Issued as a formal acknowledgment, this certificate serves as proof of sale and may be used for any future references or legal documentation. We appreciate the participation and integrity shown by all parties involved.
                    </p>
                </div>
                <div class="footer">
                    <img src="barcode_image_transparent.png" alt="Barcode">
                    <img src="stamp.png" alt="Stamp">
                </div>
                <div class="certificate-footer">
                    &copy; 2024 NextGen Auction. All Rights Reserved.<br>
                    For inquiries, please contact our support team at support@nextgenauction.com.
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create and save the HTML file
        html_filename = f"sales_certificate_{product_id}.html"
        html_filepath = os.path.join("static", html_filename)
        os.makedirs("static", exist_ok=True)
        with open(html_filepath, "w") as file:
            file.write(html_content)
        

        # Generate the PDF URL
        pdf_url = f"http://localhost:8000/static/{html_filename}"
        
        return jsonify({"message": "Certificate generated successfully", "pdfUrl": pdf_url}), 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "An error occurred while processing the data"}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=PORT)

    # app.run(debug=True, port=PORT)  # Use port from .env file
