import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import FileUploadButton from "./FileUploadButton";

const contract = require('truffle-contract');

class Models extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelsAll: [],
            purchasedModels: []
        };
    }

    componentWillMount() {
        this.getModels()
            .then(result => {
                this.setState ({
                    modelsAll: result[0],
                    purchasedModels: result[1]
                });
            });
    }

    async getModels() {
        let models = [];
        let purchasedModels = [];
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);

        let currentAddress = web3Inst.eth.coinbase;

        // Log errors, if any.
        let instance = await authContract.deployed();
        let modelIdentifiers = await instance.getIdentifiers.call();


        console.log("Number of models found: ",modelIdentifiers.length);
        for(let i = 0; i< modelIdentifiers.length; ++i) {
            let id = modelIdentifiers[i];
            let retrievedModel = await instance.getModelDetails.call(id, {from: currentAddress});
            console.log('Retrieved model:', retrievedModel);

            let bought = retrievedModel[6];
            if (bought) {
                purchasedModels.push({
                    modelId: id,
                    modelName: web3Inst.toUtf8(retrievedModel[0]),
                    designerName: web3Inst.toUtf8(retrievedModel[1]),
                    owner: retrievedModel[2],
                    description: retrievedModel[3],
                    cost: retrievedModel[4].toNumber(),
                    bcdbTxID: retrievedModel[5],
                    bought: retrievedModel[6]
                });
            }
            models.push(
                {
                    modelId: id,
                    modelName: web3Inst.toUtf8(retrievedModel[0]),
                    designerName: web3Inst.toUtf8(retrievedModel[1]),
                    owner: retrievedModel[2],
                    description: retrievedModel[3],
                    cost: retrievedModel[4].toNumber(),
                    bcdbTxID: retrievedModel[5],
                    bought: retrievedModel[6]
                });
        }

        // for(let m = 0; m < modelCount; m++) {
        //     let retrievedModel = await instance.getModel.call(m, {from: currentAddress});
        //     console.log('Retrieved model:', retrievedModel);
        //     let bought = retrievedModel[6];
        //     if(bought)
        //         purchasedModels.push({
        //             modelIndex: m,
        //             modelName:web3Inst.toUtf8(retrievedModel[0]),
        //             designerName: web3Inst.toUtf8(retrievedModel[1]),
        //             owner: retrievedModel[2],
        //             description: web3Inst.toUtf8(retrievedModel[3]),
        //             cost: retrievedModel[4].toNumber(),
        //             bcdbTxID: retrievedModel[5],
        //             bought: retrievedModel[6]
        //
        //         });
        //     models.push(
        //         {
        //             modelIndex: m,
        //             modelName:web3Inst.toUtf8(retrievedModel[0]),
        //             designerName: web3Inst.toUtf8(retrievedModel[1]),
        //             owner: retrievedModel[2],
        //             description: web3Inst.toUtf8(retrievedModel[3]),
        //             cost: retrievedModel[4].toNumber(),
        //             bcdbTxID: retrievedModel[5],
        //             bought: retrievedModel[6]
        //         });
        // }
        return new Promise(resolve => resolve([models,purchasedModels]));
    
    }

    renderPurchasedModels() {
        let web3 = store.getState().web3.web3Instance;
        let modelsList= this.state.purchasedModels.map((model, i) => {
            if (web3.eth.coinbase === model.owner) {
                return (
                    <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                        <td>{model.modelName}</td>
                        <td>{model.designerName}</td>
                        <td>{model.owner}</td>
                        <td>{model.description}</td>
                        <td>{model.bcdbTxID}</td>
                        <td>{web3.fromWei(model.cost)}</td>
                        <td>
                            {web3.eth.coinbase === model.owner && model.bought &&
                            <FileUploadButton/>
                            }
                        </td>
                    </tr>
                )
            } else {
                return (<tr></tr>)
            }
        }, this);
        if(this.state.purchasedModels.length) {
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
                            <th>Actions</th>
                        </tr>
                        </thead>
                    </table>
                </main>
            )
        }
    }

    renderAllModels() {
        let web3 = store.getState().web3.web3Instance;
        let modelsList= this.state.modelsAll.map(function(model, i) {
            return(
                <tr className={i%2===1 ? '' : 'pure-table-odd'} key={i}>
                    <td>{model.modelName}</td>
                    <td>{model.designerName}</td>
                    <td>{model.owner}</td>
                    <td>{model.description}</td>
                    <td>{model.bcdbTxID}</td>
                    <td>{web3.fromWei(model.cost)}</td>
                    <td>
                        <button className="pure-button pure-button-primary" onClick={() => this.handleBuy(model)}>Buy</button>
                    </td>
                </tr>
            )}, this);
        if(this.state.modelsAll.length) {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Models</h1>
                            <p>Buy a model below:</p>
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
                            <h1>Models</h1>
                            <p>Buy a model below:</p>
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
                            <th>Actions</th>
                        </tr>
                        </thead>
                    </table>
                </main>
            )
        }
    }

    async handleBuy(md) {
        console.log("Buy - selectedID ", JSON.stringify(md));

        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);

        authContract.setProvider(web3Inst.currentProvider);
        let currentAddress = web3Inst.eth.coinbase;

        let instance = await authContract.deployed();

        // let success = await instance.purchase(md.modelIndex, {from: currentAddress, value: md.cost});
        // console.log('Bought!: ',success);
        // return alert('Model bought successfully')
    }

    refreshModels() {
        console.log("Refreshing models");
        this.getModels()
            .then(result => {
                this.setState ({
                    modelsAll: result[0],
                    purchasedModels: result[1]
                });
            });
    }

    render() {
            return (
                <div>
                    {this.renderAllModels()}
                    <br/>
                    {this.renderPurchasedModels()}
                    <br/>
                    <button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>
                </div>
            )

    }
}

export default Models