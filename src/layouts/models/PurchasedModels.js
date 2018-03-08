import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import FileUploadButton from "./FileUploadButton";

const contract = require('truffle-contract');

class PurchasedModels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            purchasedModels: []
        };
    }

    componentWillMount() {
        this.getModels()
            .then(result => {
                this.setState ({
                    purchasedModels: result
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
        let purchasedModelIdentifiers = await instance.getPurchasedModelIds.call(currentAddress);
        console.log("Number of models found: ",purchasedModelIdentifiers.length);

        console.log("Purchased IDs: ", purchasedModelIdentifiers);
        for(let i = 0; i< purchasedModelIdentifiers.length; ++i) {
            let id = purchasedModelIdentifiers[i];
            let retrievedModel = await instance.getModelDetails.call(id, {from: currentAddress});
            purchasedModels.push({
                        modelId: id,
                        modelName: web3Inst.toUtf8(retrievedModel[0]),
                        designerName: web3Inst.toUtf8(retrievedModel[1]),
                        owner: retrievedModel[2],
                        description: retrievedModel[3],
                        cost: retrievedModel[4].toNumber(),
                        bcdbTxID: retrievedModel[5]
                        // bought: retrievedModel[6]
                    });
        }
        return new Promise(resolve => resolve(purchasedModels));

    }

    renderPurchasedModels() {
        let web3 = store.getState().web3.web3Instance;
        let modelsList= this.state.purchasedModels.map((model, i) => {
                return (
                    <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                        <td>{model.modelName}</td>
                        <td>{model.designerName}</td>
                        <td>{model.owner}</td>
                        <td>{model.description}</td>
                        <td>{model.bcdbTxID}</td>
                        <td>{web3.fromWei(model.cost)}</td>
                    </tr>
                )
        }, this);
        if(this.state.purchasedModels.length) {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Purchased models</h1>
                            <p>Models you have already bought:</p>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>Model Name</th>
                            <th>Designer</th>
                            <th>Owner's Address</th>
                            <th>Description</th>
                            <th>BigchainDB TxID</th>
                            <th>Price (ETH)</th>
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
                            <h1>Purchased models</h1>
                            <p>Upload a copy of the model below:</p>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>Model Name</th>
                            <th>Designer</th>
                            <th>Owner's Address</th>
                            <th>Description</th>
                            <th>BigchainDB TxID</th>
                            <th>Price (ETH)</th>
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
                    purchasedModels: result
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
}

export default PurchasedModels