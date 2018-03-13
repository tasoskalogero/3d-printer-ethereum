import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';

const contract = require('truffle-contract');

const fitContent = {
    width: '300px',
    wordWrap:'break-word',
};

const PRINTER = "0x821aea9a577a9b44299b9c15c88cf3087f3b5544";

class UploadedCopies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedCopies: []
        };
    }

    componentWillMount() {
        this.getModels()
            .then(result => {
                this.setState ({
                    uploadedCopies: result
                });
            });
    }

    async getModels() {
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);

        let currentAddress = web3Inst.eth.coinbase;

        // Log errors, if any.
        let instance = await authContract.deployed();

        let purchasedModels = [];
        let modelCopyIdentifiers = await instance.getModelCopyIdentifiers.call();
        console.log("Number of COPY models found: ",modelCopyIdentifiers.length);

        for(let i = 0; i< modelCopyIdentifiers.length; ++i) {
            let id = modelCopyIdentifiers[i];
            let modelCopyDetails = await instance.getModelCopyDetails.call(id, {from: currentAddress});
            console.log('Retrieved COPY model:', modelCopyDetails);
            purchasedModels.push({
                        copyModelID: id,
                        masterModelID: modelCopyDetails[0],
                        purchaseID: modelCopyDetails[1],
                        bcdbTxID: modelCopyDetails[2]
                    });
        }
        return new Promise(resolve => resolve(purchasedModels));

    }

    renderCopyModels() {
        let web3 = store.getState().web3.web3Instance;
        let currentAddress = web3.eth.coinbase;
        let copyModelsList= this.state.uploadedCopies.map((model, i) => {
            return (
                <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                    <td><div style={fitContent}>{model.copyModelID}</div></td>
                    <td><div style={fitContent}>{model.masterModelID}</div></td>
                    <td><div style={fitContent}>{model.purchaseID}</div></td>
                    <td><div style={fitContent}>{model.bcdbTxID}</div></td>
                    {currentAddress.toUpperCase() === PRINTER.toUpperCase() ?
                        (<td>
                            <button className="pure-button pure-button-primary"
                                    onClick={() => this.handlePrint(model.masterModelID, model.purchaseID)}>Print
                            </button>
                        </td>):(<td></td>)}
                </tr>
            )
        }, this);
        if(this.state.uploadedCopies.length) {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Uploaded copies</h1>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>Copy Model ID</th>
                            <th>Master Model ID</th>
                            <th>Purchase ID</th>
                            <th>BigchainDB TxID</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {copyModelsList}
                        </tbody>
                    </table>
                </main>
            )}
        else {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Uploaded copies</h1>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>Copy Model ID</th>
                            <th>Master Model ID</th>
                            <th>Purchase ID</th>
                            <th>BigchainDB TxID</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                    </table>
                </main>
            )
        }
    }
    refreshModels() {
        console.log("Refreshing models");
        this.getModels()
            .then(result => {
                this.setState ({
                    uploadedCopies: result
                });
            });
    }

    render() {
            return (
                <div>
                    {this.renderCopyModels()}
                    <button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>
                </div>
            )

    }

    async handlePrint(masterModelID, purchaseID) {
        console.log("Printing.... ");

        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);
        let currentAddress = web3Inst.eth.coinbase;
        let instance = await authContract.deployed();

        let purchaseDetails = await instance.getPurchaseByID.call(purchaseID, {from: currentAddress});
        let buyer = purchaseDetails[0];

        let cost = await instance.getPurchaseCost.call(purchaseID, masterModelID, {from: currentAddress});
        let masterModelDetails = await instance.getMasterModelDetails.call(masterModelID, {from: currentAddress});
        let owner = masterModelDetails[2];

        let success = await instance.executeTransfer(purchaseID, masterModelID, owner, {from: currentAddress});

        // let retrievedModel = await instance.getModelDetails.call(masterModelID, {from: currentAddress});
        // let owner = retrievedModel[2];
        // let buyer = retrievedModel[6];
        // console.log("Owner: ", owner);
        // console.log("Buyer: " ,buyer);
        // let success = await instance.executeTransfer(buyer, owner, masterModelID, {from: currentAddress});
        console.log("Purchase comleted: ", success);
        return alert('Purchase comleted successfully')
    }
}

export default UploadedCopies