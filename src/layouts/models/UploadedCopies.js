import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';

const contract = require('truffle-contract');
const tdStyle = {
    width:'300px',
    wordWrap:'break-word',
    display: 'inline-block'
};

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

    renderPurchasedModels() {
        let modelsList= this.state.uploadedCopies.map((model, i) => {
            return (
                <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                    <td style={tdStyle}>{model.modelId}</td>
                    <td style={tdStyle}>{model.bcdbTxID}</td>
                    <td>
                        <button className="pure-button pure-button-primary"
                                onClick={() => this.handlePrint(model)}>Print
                        </button>
                    </td>
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
                    {this.renderPurchasedModels()}
                    <button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>
                </div>
            )

    }

    handlePrint(model) {
        console.log("Printing.... ", model);
    }
}

export default UploadedCopies