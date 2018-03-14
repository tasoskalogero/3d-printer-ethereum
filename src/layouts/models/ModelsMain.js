import React, { Component } from 'react'
import PurchasedModels from "./PurchasedModels";
import RegisteredModels from "./RegisteredModels";
import UploadedCopies from "./UploadedCopies";

class Models extends Component {

    constructor(props) {
        super(props);
        this.handleNewPurchase = this.handleNewPurchase.bind(this);
    }

    handleNewPurchase () {
        this.refs.purchasesComponent.refreshModels();
    };

    render() {
        return (
            <div>
                <RegisteredModels onNewPurchase={this.handleNewPurchase}/>
                <PurchasedModels ref="purchasesComponent"/>
                <UploadedCopies/>
            </div>
        )

    }
}

export default Models