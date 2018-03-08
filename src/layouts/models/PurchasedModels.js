import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import FileUploadButton from "./FileUploadButton";

const contract = require('truffle-contract');

const tdStyle = {
    width:'300px',
    wordWrap:'break-word',
    display: 'inline-block'
};

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
        let purchasedModelIdentifiers = await instance.getPurchasedModelIds.call();
        console.log("Number of PURCHASED models found: ",purchasedModelIdentifiers.length);

        for(let i = 0; i< purchasedModelIdentifiers.length; ++i) {
            let id = purchasedModelIdentifiers[i];
            let modelCopyDetails = await instance.getModelCopyDetails.call(id, {from: currentAddress});
            console.log(modelCopyDetails);
            let retrievedModel = await instance.getModelDetails.call(id, {from: currentAddress});
            console.log('Retrieved PURCHASED model:', retrievedModel);
            purchasedModels.push({
                        modelId: id,
                        modelName: web3Inst.toUtf8(retrievedModel[0]),
                        designerName: web3Inst.toUtf8(retrievedModel[1]),
                        owner: retrievedModel[2],
                        description: retrievedModel[3],
                        cost: retrievedModel[4].toNumber(),
                        bcdbTxID: retrievedModel[5],
                        uploadExists: modelCopyDetails[1] //true if there is an uploaded copy of this model
                    });
        }
        return new Promise(resolve => resolve(purchasedModels));

    }

    renderPurchasedModels() {
        let web3 = store.getState().web3.web3Instance;
        let currentAddress = web3.eth.coinbase;
        let modelsList= this.state.purchasedModels.map((model, i) => {
                return (
                    <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                        <td style={tdStyle}>{model.modelId}</td>
                        <td>{model.modelName}</td>
                        <td>{model.designerName}</td>
                        <td>{model.owner}</td>
                        <td>{model.description}</td>
                        <td style={tdStyle}>{model.bcdbTxID}</td>
                        <td>{web3.fromWei(model.cost)}</td>
                        {currentAddress === model.owner && !model.uploadExists?
                            (<td><FileUploadButton modelToUpload={model}/></td>) : (<td></td>)
                        }
                    </tr>
                )
        }, this);
        if(this.state.purchasedModels.length) {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Purchased models</h1>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Model Name</th>
                            <th>Designer</th>
                            <th>Owner's Address</th>
                            <th>Description</th>
                            <th>BigchainDB TxID</th>
                            <th>Price (ETH)</th>
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
                            <h1>Purchased models</h1>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Model Name</th>
                            <th>Designer</th>
                            <th>Owner's Address</th>
                            <th>Description</th>
                            <th>BigchainDB TxID</th>
                            <th>Price (ETH)</th>
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