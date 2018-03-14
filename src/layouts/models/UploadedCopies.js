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
                        bcdbTxID: modelCopyDetails[2],
                        printed: modelCopyDetails[3]
                    });
        }
        return new Promise(resolve => resolve(purchasedModels));

    }

    renderCopyModels() {
        let web3 = store.getState().web3.web3Instance;
        let currentAddress = web3.eth.coinbase;
        let copyModelsList= this.state.uploadedCopies.map((model, i) => {
            if(currentAddress.toUpperCase() === PRINTER.toUpperCase() ) {
                return (
                    <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                        <td>
                            <div style={fitContent}>{model.copyModelID}</div>
                        </td>
                        <td>
                            <div style={fitContent}>{model.masterModelID}</div>
                        </td>
                        <td>
                            <div style={fitContent}>{model.purchaseID}</div>
                        </td>
                        <td>
                            <div style={fitContent}>{model.bcdbTxID}</div>
                        </td>
                        {!model.printed ?
                            (<td>
                                <button className="pure-button pure-button-primary"
                                        onClick={() => this.handlePrint(model.copyModelID, model.masterModelID, model.purchaseID)}>Print
                                </button>
                            </td>) : (<td></td>)}
                    </tr>
                )
            }
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
                    <p>Please click the Refresh button if the entry doesn't appear above.</p>
                    <button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>
                </div>
            )

    }

    async handlePrint(copyModelID, masterModelID, purchaseID) {
        console.log("Printing.... ");

        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);
        let currentAddress = web3Inst.eth.coinbase;
        let instance = await authContract.deployed();


        let masterModelDetails = await instance.getMasterModelDetails.call(masterModelID, {from: currentAddress});
        let owner = masterModelDetails[2];

        let success = await instance.executeTransfer(copyModelID, purchaseID, owner, {from: currentAddress});

        return alert('Purchase comleted successfully')
    }

}

export default UploadedCopies