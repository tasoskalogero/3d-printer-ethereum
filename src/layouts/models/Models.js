import React, { Component } from 'react'

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
];

class Models extends Component {
    constructor(props) {
        super(props);
    }

    handleBuy(id) {
        console.log("Buy - selectedID ", id);
    }

    render() {
        let modelsList= modelEntries.map(function(model, i) {
            return(
                <tr key={i}>
                    <td>{model.id}</td>
                    <td>{model.modelName}</td>
                    <td>{model.cost}</td>
                    <td>{model.description}</td>
                    <td>{model.designerName}</td>
                    <td >
                    <button className="pure-button pure-button-primary" onClick={() => this.handleBuy(model.id)}>Buy</button>
                    </td>
                </tr>
            )}, this);
        return  (

            <main className="container">

                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1>Models</h1>
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