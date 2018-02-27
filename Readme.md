This project is a combination of BigchainDB and Ethereum Smart Contracts. The demo is a secured, decentralized method to exchange 3D Printer files for usage between untrusted parties, without revealing the actual 3D Model Blueprint.

TO START THE DEMO:

1. Simply clone the repo and run 'npm install' in the main directory.
2. Run 'truffle dev' in the terminal to launch Ganache-CLI.
3. Run 'truffle compile' followed by 'truffle migrate' to compile and migrate the smart contracts.
4. Run 'npm start dev' to launch the demo application.

Note: You must have Metamask installed and connected to http://localhost:9545 in order to access the appropriate public addresses. Copy the seed words that are generated from truffle dev into metamask to retrieve the accounts. For all transferring of data to the blockchain of any kind, you must verify the transaction via metamask in order to instantiate the process.



USAGE OF THE APPLICATION:

Click on the Sign Up button in the top right to create a user name which will link your public address to this username on the Dapp.

From here, you will be logged into your dashboard where you first must upload your 3D blueprint with the appropriate uploader. This upload only accepts 3D Printer compatible files (.STL). Next type in the information about the desired file. Once you click submit, the file is published to BigchainDB and the file information is stored on an Ethereum Smart Contract as a model. To view all the uploaded models, you can navigate to the Models page where you can then purchase the uploaded models. Once you click 'Buy', ether will be transferred to the address of the user (the designer) who originally uploaded the file.



