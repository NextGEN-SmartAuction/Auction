import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PinataSDK } from "pinata-web3";
import Web3Connector from "./Web3Connector";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pinata = new PinataSDK({
    pinataJwt: `${process.env.REACT_APP_PinataJwt}`,
    pinataGateway: `${process.env.REACT_APP_PinataGateway}`,
});

const GenerateCertificate = () => {
    const location = useLocation();
    const { product } = location.state || {};
    const [certificateUrl, setCertificateUrl] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const [account, setAccount] = useState("");
    const [contract1, setContract1] = useState(null);
    const [contractStatus, setContractStatus] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();

    const handleFetchCertificate = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FlaskUrl}/generateCertificate`,
                { ...product },
                { headers: { "Content-Type": "application/json" } }
            );
            const data = response.data;
            setCertificateUrl(data.pdfUrl);
        } catch (error) {
            console.error("Error fetching certificate:", error);
        }
    };

    const handleFileUpload = (event) => {
        setUploadedFile(event.target.files[0]);
    };

    const handleUploadAndStore = async () => {
        if (!uploadedFile) {
            setUploadStatus("Please select a file to upload.");
            return;
        }

        try {
            setUploadStatus("Uploading to IPFS...");
            const file = new File([uploadedFile], uploadedFile.name, {
                type: uploadedFile.type,
            });
            const upload = await pinata.upload.file(file);
            const ipfsHash = upload.IpfsHash;
            setUploadStatus(`Upload successful! IPFS Hash: ${ipfsHash}`);

            // Wait for 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setUploadStatus("Uploading to Web3...");
            const result = await contract1.methods
                .addPurchase(
                    product.productId,
                    product.productName,
                    product.sellerId,
                    product.sellerName,
                    product.bidderId,
                    product.bidderName,
                    product.amount,
                    product.transactionId,
                    product.date,
                    product.time,
                    ipfsHash
                )
                .send({ from: account });

            console.log(result);

            setUploadStatus("Certificate stored in MongoDB!");
            await updateTransactionIpfsHash(product.productId, ipfsHash);

            // Update product status
            await updateProductStatus(product.productId);

            setUploadStatus("Certificate stored on Blockchain!");

            // Redirect after 4 seconds
            setTimeout(() => {
                navigate("/admin/SaleCertificate");
            }, 4000);
        } catch (error) {
            setUploadStatus(`Failed to upload and store certificate: ${error.message}`);
        }
    };

    const updateProductStatus = async (productId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_ServerUrl}/updateProductStatus`,
                { productId, newStatus: "sold" },
                { withCredentials: true }
            );

            console.log("Product status updated:", response.data);
        } catch (error) {
            console.error(
                "Error updating product status:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const updateTransactionIpfsHash = async (productId, ipfsHash) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_ServerUrl}/updateIpfsHash`,
                { productId, ipfsHash },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Transaction IPFS Hash updated:", response.data);
        } catch (error) {
            console.error(
                "Error updating IPFS Hash in the database:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const handlePrintCertificate = () => {
        if (!certificateUrl) {
            alert("Certificate URL is not available.");
            return;
        }

        const newTab = window.open("", "_blank");

        if (newTab) {
            newTab.document.write(`
                <iframe 
                    src="${certificateUrl}" 
                    style="width:100%; height:98%; border:none;" 
                    onload="window.print();">
                </iframe>
            `);
            newTab.document.title = `${product.productId}_certificate.pdf`;
            newTab.document.close();
        } else {
            alert("Failed to open the certificate. Please check your pop-up settings.");
        }
    };

    const handleCopyPdfName = () => {
        if (!certificateUrl) {
            toast.error("Certificate URL is not available.");
            return;
        }
    
        const pdfName = `${product.productId}_certificate`;
    
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(pdfName)
                .then(() => {
                    toast.success("PDF name copied to clipboard!");
                })
                .catch((error) => {
                    console.error("Failed to copy PDF name:", error);
                    toast.error("Failed to copy PDF name.");
                });
        } else {
            // Fallback for unsupported browsers
            const textarea = document.createElement("textarea");
            textarea.value = pdfName;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
                toast.success("PDF name copied to clipboard!");
            } catch (error) {
                console.error("Failed to copy using fallback:", error);
                toast.error("Failed to copy PDF name.");
            }
            document.body.removeChild(textarea);
        }
    };
    
    

    return (
        <>
            <Web3Connector
                setAccount={setAccount}
                setContract={setContract1}
                setContractStatus={setContractStatus}
            />
            <div className="container py-4">
                <h2 className="text-center">Generate Sale Certificate</h2>
                <p className="text-center">
                    <strong>Product:</strong> {product.productName}
                </p>
                <div className="d-flex justify-content-center mb-3">
                    <button className="btn btn-primary mx-2" onClick={handleFetchCertificate}>
                        Fetch Certificate
                    </button>
                </div>
                {certificateUrl && (
                    <div className="text-center">
                        <iframe
                            src={certificateUrl}
                            title="Sale Certificate"
                            className="w-75"
                            style={{ height: "500px", border: "1px solid #ccc" }}
                        ></iframe>
                        <div className="mt-3">
                            <input
                                type="file"
                                accept="application/pdf"
                                className="form-control d-inline w-auto"
                                onChange={handleFileUpload}
                            />
                            <button
                                className="btn btn-success mx-2"
                                onClick={handleUploadAndStore}
                            >
                                Upload to IPFS and Store in Web3
                            </button>
                            <button
                                className="btn btn-secondary mx-2"
                                onClick={handlePrintCertificate}
                            >
                                Print Certificate to PDF
                            </button>
                            <button
                                className="btn btn-info mx-2"
                                onClick={handleCopyPdfName}
                            >
                                Copy PDF Name
                            </button>
                        </div>
                        {uploadStatus && <p className="mt-3 text-info">{uploadStatus}</p>}
                    </div>
                )}
            </div>
            <ToastContainer />
        </>
    );
};

export default GenerateCertificate;
