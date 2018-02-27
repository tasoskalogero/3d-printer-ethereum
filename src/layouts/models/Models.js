import React, { Component } from 'react'

import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';

const contract = require('truffle-contract');

class Models extends Component {

    constructor(props) {
        console.log("Constructor");
        super(props);
        this.state = {
            modelsAll: []
        }
    }

    componentWillMount() {
        this.getModels()
            .then(models => {
                this.setState ({
                    modelsAll: models
                });
            });
    }

    async getModels() {
        let models = [];
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);

        authContract.setProvider(web3Inst.currentProvider);
        let coinbase = web3Inst.eth.getCoinbase();
        
        // Log errors, if any.
        let instance = await authContract.deployed();
        let count = await instance.getModelCount.call();
        let modelCount = count.toNumber();



        console.log("Number of models found: ",modelCount);
        for(let m = 0; m < modelCount; m++) {
            let retrievedModel = await instance.getModel.call(m, {from: coinbase});
            models.push(
                {modelName:web3Inst.toUtf8(retrievedModel[0]),
                    designerName: web3Inst.toUtf8(retrievedModel[1]),
                    modelAddr: retrievedModel[2],
                    description: web3Inst.toUtf8(retrievedModel[3]),
                    cost: retrievedModel[4].toNumber()});
        }
        return new Promise(resolve => resolve(models));
    
}

    handleBuy(md) {
        console.log("Buy - selectedID ", JSON.stringify(md));
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);

        authContract.setProvider(web3Inst.currentProvider);
        let coinbase = web3Inst.eth.getCoinbase();
        
        // Log errors, if any.
        let instance = authContract.deployed(); // Maybe add await here
    }

    refreshModels() {
        console.log("Refreshing models");
        this.getModels()
            .then(models => {
                this.setState ({
                    modelsAll: models
                });
            });
    }


    render() {
        //TODO get models from smart contract
        let modelsList= this.state.modelsAll.map(function(model, i) {
            return(
                <tr className={i%2===1 ? '' : 'pure-table-odd'} key={i}>
                    <td>{model.modelName}</td>
                    <td>{model.designerName}</td>
                    <td>{model.modelAddr}</td>
                    <td>{model.description}</td>
                    <td>{model.cost}</td>
                    <td >
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
                            <th>Designer's Address</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {modelsList}
                        </tbody>
                    </table>
                    <button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>
                </main>
            );
        } else {
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
                            <th>Model Address</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                    </table>
                    <button className="pure-button pure-button-primary">Refresh</button>
                </main>
            )}
    }
}

export default Models