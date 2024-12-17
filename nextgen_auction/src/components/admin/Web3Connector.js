import { useEffect, useState } from "react";
import Web3 from "web3";

function Web3Connector({ setAccount, setContract, setContractStatus }) {

    useEffect(() => {
        // const { ethereum } = window;
        const connectMetamask = async () => {
            if (window.ethereum !== "undefined") {
                try {
                    console.log("hari");
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                        "params": [],
                    });
                    setAccount(accounts[0]);
                    console.log(accounts[0]);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        const connectContract = async () => {
            const { ethereum } = window;
            try {
                const ABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
                const Address = process.env.REACT_APP_AdminAddress;
                const web3 = new Web3(ethereum);
                const contract1 = new web3.eth.Contract(ABI, Address);
                setContract(contract1);
                setContractStatus("Connection Status: Success");
            } catch (error) {
                console.log(error);
            }
        };

        connectMetamask();
        connectContract();
    }, [setAccount, setContract, setContractStatus]);

    return null; // Since this component doesn't render anything
}

export default Web3Connector;
