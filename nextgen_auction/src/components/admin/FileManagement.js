import React, { useState } from "react";
import { PinataSDK } from "pinata-web3";
import Web3Connector from "./Web3Connector";
const pinata = new PinataSDK({
    pinataJwt: `${process.env.REACT_APP_PinataJwt}`,
    pinataGateway: `${process.env.REACT_APP_PinataGateway}`,
});


const FileManagement = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [retrievalHash, setRetrievalHash] = useState("");
    const [retrievalStatus, setRetrievalStatus] = useState("");
    const [retrievedData, setRetrievedData] = useState(null);
    const [account, setAccount] = useState("");
    const [contract1, setContract1] = useState(null);
    const [contractStatus, setContractStatus] = useState("");

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("Please select a file to upload.");
            return;
        }

        try {
            setUploadStatus("Uploading...");
            const file = new File([selectedFile], selectedFile.name, {
                type: selectedFile.type,
            });
            const upload = await pinata.upload.file(file);
            setUploadStatus(`Upload successful! IPFS Hash: ${upload.IpfsHash}`);
            // const result1 = await contract1.methods.addPurchase("harinath", "surya", "1234", upload.IpfsHash).send({ from: account });
        } catch (error) {
            setUploadStatus(`Upload failed: ${error.message}`);
        }
    };

    // Handle file retrieval
    const handleRetrieve = async () => {
        if (!retrievalHash) {
            setRetrievalStatus("Please provide a valid IPFS hash.");
            return;
        }

        try {
            setRetrievalStatus("Retrieving data...");
            const data = await pinata.gateways.get(retrievalHash);
            setRetrievedData(data);
            setRetrievalStatus("Data retrieved successfully!");
        } catch (error) {
            setRetrievalStatus(`Retrieval failed: ${error.message}`);
        }
    };




    return (
        <>
            <Web3Connector
                setAccount={setAccount}
                setContract={setContract1} // Update the contract1 state value
                setContractStatus={setContractStatus}
            />

            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Pinata File Management</h2>

                {/* File Upload Section */}
                <div style={{ marginBottom: "30px" }}>
                    <h3>File Upload</h3>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
                        Upload
                    </button>
                    {uploadStatus && <p>{uploadStatus}</p>}
                </div>


                {/* File Retrieval Section */}
                <div>
                    <h3>File Retrieval</h3>
                    <input
                        type="text"
                        placeholder="Enter IPFS hash"
                        value={retrievalHash}
                        onChange={(e) => setRetrievalHash(e.target.value)}
                        style={{ width: "300px", marginRight: "10px" }}
                    />
                    <button onClick={handleRetrieve}>Retrieve</button>
                    {retrievalStatus && <p>{retrievalStatus}</p>}
                    {retrievedData && (
                        <div>
                            <h4>Retrieved Data:</h4>
                            <pre
                                style={{
                                    backgroundColor: "#f4f4f4",
                                    padding: "10px",
                                    textAlign: "left",
                                    overflowX: "auto",
                                }}
                            >
                                {JSON.stringify(retrievedData, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FileManagement;
