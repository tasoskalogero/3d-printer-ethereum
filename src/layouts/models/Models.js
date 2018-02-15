import React, { Component } from 'react'

import ModelRegistryContract from '../../../build/contracts/ModelRegistry'
import store from "../../store";


const contract = require('truffle-contract');

const modelEntries = [
    {
        id: 1,
        modelName: 'Model1',
        cost: 100,
        description: 'First model',
        designerName: 'Designer1'
    },
    {
        id: 2,
        modelName: 'Model2',
        cost: 200,
        description: 'Second model',
        designerName: 'Designer2'
    },
    {
        id: 3,
        modelName: 'Model3',
        cost: 300,
        description: 'Third model',
        designerName: 'Designer3'
    },
    {
        id: 4,
        modelName: 'Model4',
        cost: 400,
        description: 'Fourth model',
        designerName: 'Designer4'
    }
];

class Models extends Component {

    web3Inst = store.getState().web3.web3Instance;

    constructor(props) {
        super(props);

    }

    getModels() {
        const modelRegistry = contract(ModelRegistryContract);
        modelRegistry.setProvider(this.web3Inst.currentProvider);
        modelRegistry.deployed().then(function(instance) {
            return instance.testID.call();
        })
            .then(result => {
                console.log(result.toNumber());
            });
    }

    handleBuy(md) {
        this.getModels();
        console.log("Buy - selectedID ", JSON.stringify(md));

    }

    render() {
        //TODO get models from smart contract
        let modelsList= modelEntries.map(function(model, i) {
            return(
                <tr className={i%2===1 ? '' : 'pure-table-odd'} key={i}>
                    <td>{model.id}</td>
                    <td>{model.modelName}</td>
                    <td>{model.cost}</td>
                    <td>{model.description}</td>
                    <td>{model.designerName}</td>
                    <td >
                    <button className="pure-button pure-button-primary" onClick={() => this.handleBuy(model)}>Buy</button>
                    </td>
                </tr>
            )}, this);
        return  (

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
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Designer</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {modelsList}
                    </tbody>
                </table>
            </main>
        )
    }
}

export default Models