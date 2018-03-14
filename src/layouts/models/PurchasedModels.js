import React, { Component } from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import FileUploadButton from "./FileUploadButton";

const contract = require('truffle-contract');

const fitContent = {
    width: '300px',
    wordWrap:'break-word',
};

class PurchasedModels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            purchases: [],
            status:''
        };
        this.handleNewCopyUpload = this.handleNewCopyUpload.bind(this);
    }

    componentWillMount() {
        this.getPurchases()
            .then(result => {
                this.setState ({
                    purchases: result
                });
            });
    }

    async getPurchases() {
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);

        let currentAddress = web3Inst.eth.coinbase;

        let instance = await authContract.deployed();

        let purchases = [];
        let purchaseIdentifiers = await instance.getPurchaseIDs.call();
        console.log("Number of PURCHASES found: ",purchaseIdentifiers.length);

        for(let i = 0; i< purchaseIdentifiers.length; ++i) {
            let pID = purchaseIdentifiers[i];

            let purchaseDetails = await instance.getPurchaseByID.call(pID,{from: currentAddress});
            let buyer = purchaseDetails[0];
            let owner = purchaseDetails[1];
            let masterModelID = purchaseDetails[2];
            let uploaded = purchaseDetails[4];
            purchases.push({
                purchaseID: pID,
                masterModelID: masterModelID,
                buyer: buyer,
                owner: owner,
                uploaded: uploaded,
            })
        }
        return new Promise(resolve => resolve(purchases));

    }

    handleNewCopyUpload () {
        this.refreshModels();
    };

    renderPurchases() {
        let web3 = store.getState().web3.web3Instance;
        let currentAddress = web3.eth.coinbase;
        let purchasesList= this.state.purchases.map((purchase, i) => {
            if(purchase.buyer === currentAddress || currentAddress === purchase.owner) {
                return (
                    <tr className={i % 2 === 1 ? '' : 'pure-table-odd'} key={i}>
                        <td> <div style={fitContent}>{purchase.purchaseID}</div></td>
                        <td><div style={fitContent}>{purchase.masterModelID}</div></td>
                        <td>{purchase.buyer}</td>
                        <td>{purchase.owner}</td>
                        {currentAddress === purchase.owner && !purchase.uploaded?
                            (<td><FileUploadButton onNewCopyUpload={this.handleNewCopyUpload} purchaseID={purchase.purchaseID} masterModelID={purchase.masterModelID}/></td>)
                            : (<td></td>)
                        }
                    </tr>
                )
            }
        }, this);
        if(this.state.purchases.length) {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Purchases</h1> <div>{this.state.status}</div>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>Purchase ID</th>
                            <th>Master Model ID</th>
                            <th>Buyer</th>
                            <th>Owner</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {purchasesList}
                        </tbody>
                    </table>
                </main>
            )}
        else {
            return (
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Purchases</h1> <div>{this.state.status}</div>
                        </div>
                    </div>

                    <table className="pure-table">
                        <thead>
                        <tr>
                            <th>Purchase ID</th>
                            <th>Master Model ID</th>
                            <th>Buyer</th>
                            <th>Owner</th>
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
        this.setState({status:'Refreshing purchases...Please wait'});
        setTimeout(function() {
            this.getPurchases()
                .then(result => {
                    this.setState ({
                        purchases: result,
                        status:''
                    });
                });
        }.bind(this), 7000);
    }

    render() {
            return (
                <div>
                    {this.renderPurchases()}
                    {/*<button className="pure-button pure-button-primary" onClick={() => this.refreshModels()}>Refresh</button>*/}
                </div>
            )

    }
}

export default PurchasedModels