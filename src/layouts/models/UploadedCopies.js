import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';

const contract = require('truffle-contract');

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
            let modelDetails = await instance.getModelCopyDetails.call(id, {from: currentAddress});
            console.log('Retrieved COPY model:', modelDetails);
            purchasedModels.push({
                        modelId: id,
                        bcdbTxID: modelDetails[0]
                    });
        }
        return new Promise(resolve => resolve(purchasedModels));

    }

    renderCopyModels() {
        let web3 = store.getState().web3.web3Instance;
        let currentAddress = web3.eth.coinbase;
        let modelsList= this.state.uploadedCopies.map((model, i) => {
            return (
                <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                    <td>{model.modelId}</td>
                    <td>{model.bcdbTxID}</td>
                    {currentAddress.toUpperCase() === PRINTER.toUpperCase() ?
                        (<td>
                            <button className="pure-button pure-button-primary"
                                    onClick={() => this.handlePrint(model)}>Print
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
                            <th>ID</th>
                            <th>BigchainDB TxID</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {modelsList}
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
                            <th>ID</th>
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

    async handlePrint(model) {
        console.log("Printing.... ", model);

        let masterModelID = model.modelId;
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);

        let currentAddress = web3Inst.eth.coinbase;

        // Log errors, if any.
        let instance = await authContract.deployed();
        let retrievedModel = await instance.getModelDetails.call(masterModelID, {from: currentAddress});
        let buyer = retrievedModel[2];
        let owner = retrievedModel[6];
        console.log(buyer);
        console.log(owner);
        let success = await instance.executeTransfer.call(buyer, owner, masterModelID, {from: currentAddress});
        console.log("Purchase comleted: ", success);
        return alert('Purchase comleted successfully')
    }
}

export default UploadedCopies