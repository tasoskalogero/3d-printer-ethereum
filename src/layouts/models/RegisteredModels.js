import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';

const contract = require('truffle-contract');

const tdStyle = {
    width:'300px',
    wordWrap:'break-word',
    display: 'inline-block'
};

class RegisteredModels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modelsAll: []
        };
    }
    componentWillMount() {
        this.getModels()
            .then(result => {
                this.setState ({
                    modelsAll: result,
                });
            });
    }

    refreshModels() {
        console.log("Refreshing models");
        this.getModels()
            .then(result => {
                this.setState ({
                    modelsAll: result
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
        let modelIdentifiers = await instance.getModelIdentifiers.call();

        console.log("Number of models found: ",modelIdentifiers.length);
        let models = [];
        for(let i = 0; i< modelIdentifiers.length; ++i) {
            let id = modelIdentifiers[i];
            let retrievedModel = await instance.getModelDetails.call(id, {from: currentAddress});
            console.log('Retrieved model:', retrievedModel);

            models.push(
                {
                    modelId: id,
                    modelName: web3Inst.toUtf8(retrievedModel[0]),
                    designerName: web3Inst.toUtf8(retrievedModel[1]),
                    owner: retrievedModel[2],
                    description: retrievedModel[3],
                    cost: retrievedModel[4].toNumber(),
                    bcdbTxID: retrievedModel[5]
                });
        }

        return new Promise(resolve => resolve(models));
    
    }

    renderAllModels() {
        let web3 = store.getState().web3.web3Instance;
        let modelsList= this.state.modelsAll.map(function(model, i) {
            return(
                <tr className={i%2===1 ? '' : 'pure-table-odd'} key={i}>
                    <td style={tdStyle}>{model.modelId}</td>
                    <td>{model.modelName}</td>
                    <td>{model.designerName}</td>
                    <td>{model.owner}</td>
                    <td>{model.description}</td>
                    <td style={tdStyle}>{model.bcdbTxID}</td>
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
                            <h1>Available models</h1>
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
                            <h1>Available models</h1>
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

    async handleBuy(md) {
        console.log("Buy - selectedID ", JSON.stringify(md));

        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);

        authContract.setProvider(web3Inst.currentProvider);
        let currentAddress = web3Inst.eth.coinbase;

        let instance = await authContract.deployed();

        let success = await instance.purchase(md.modelId, {from: currentAddress, value: md.cost});
        console.log('Bought!: ',success);
        return alert('Model bought successfully')

    }

    render() {
        return (
            <div>
                {this.renderAllModels()}
                <button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>
            </div>
        )

    }
}

export default RegisteredModels