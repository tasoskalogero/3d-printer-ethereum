#### README

This project is a combination of BigchainDB and Ethereum Smart Contracts. The demo is a secured, decentralized method to exchange 3D Printer files for usage between untrusted parties, without revealing the actual 3D Model Blueprint.

#### TO START THE DEMO:

1. Simply clone the repo and run `npm install` in the main directory.
2. Open a console and run `truffle dev` in the terminal to launch the blockchain test network.
3. Run `compile` followed by `migrate` to compile and migrate the smart contracts.
4. Open a new console and run `npm start` to launch the demo application.

##### Note: 
Metamask must be installed and connected to http://localhost:9545 in order to access the appropriate public addresses. 
Copy the seed words that are generated from truffle dev into metamask to retrieve the accounts. 
For storing data to the blockchain, you must verify the transaction via metamask in order to instantiate the process.


#### USAGE OF THE APPLICATION:

Click on the Sign Up button in the top right to create a user name which will link your public address to 
this username on the Dapp.

From there, you will be logged into your dashboard where you can upload your 3D model by filling additional information 
about the desired file. 
Once you click submit, the file is published to BigchainDB and the file information is stored on 
an Ethereum Smart Contract as a model. 

To view all the uploaded models, you can navigate to the Models page where you can then purchase any model. 
Once you click 'Buy', the cost of the model in ether will be deducted from your account and it will be blocked
until the model is printed.

A printer can print a model after an uploaded copy of the purchased model is available.
When the "print" button is clicked, the blocked amount will be transferred to the address of the user (the designer) 
who originally uploaded the file.


##### Permissions

* Any user can upload a model from the Dashboard and buy a model in the Models page.
* Only the user who is the owner of a purchased 3D model can upload a copy file.  
* Only specific addresses are allowed to see the uploaded 3D copies and "print" models. 
    * For demo purposes only, a printer is hardcoded in the smart contract with the address: `0x821aea9a577a9b44299b9c15c88cf3087f3b5544`
