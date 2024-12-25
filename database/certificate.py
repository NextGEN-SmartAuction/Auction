import random
from barcode import Code128
from barcode.writer import ImageWriter
from datetime import datetime
from PIL import Image
import hashlib
# Sample data


# Randomly select data
random_product = random.choice(products)
random_bidder = random.choice(bidders)
random_seller = random.choice(sellers)
random_upi = random.choice(upi_ids)
today_date = datetime.now().strftime("%Y-%m-%d")
random_time = datetime.now().strftime("%H:%M:%S")
final_bid_amount = round(random.uniform(100, 10000), 2)

# Step 1: Generate barcode
barcode_details = f"Bidder: {random_bidder}, Seller: {random_seller}, UPI ID: {random_upi}"
hashed_details = hashlib.sha256(barcode_details.encode('utf-8')).hexdigest()
# Save the hashed data in a barcode
barcode_name ="barcode_image"
barcode = Code128(hashed_details, writer=ImageWriter())
barcode.save(barcode_name)

# Step 2: Make barcode transparent
transparent_barcode_name = f"{barcode_name}_transparent.png"
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
                On <strong>{today_date}</strong>, the product <strong>{random_product}</strong>, described as "(Brief Description of the Product)," was successfully auctioned to <strong>{random_bidder}</strong>. The auction, listed by <strong>{random_seller}</strong>, concluded with a final bid amount of <strong>${final_bid_amount}</strong>, awarded at <strong>{random_time}</strong>.
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

html_filename = "sales_certificate.html"
try:
    with open(html_filename, "w") as file:
        file.write(html_content)
    print(f"Certificate saved: {html_filename}")
except Exception as e:
    print(f"Error saving HTML certificate: {e}")
