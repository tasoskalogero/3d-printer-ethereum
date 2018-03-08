import React, { Component } from 'react'
import PurchasedModels from "./PurchasedModels";
import RegisteredModels from "./RegisteredModels";
import UploadedCopies from "./UploadedCopies";

class Models extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updatePurchases: false
        };
    }

    render() {
        return (
            <div>
                <RegisteredModels/>
                <br/>
                <PurchasedModels/>
                <br/>
                <UploadedCopies/>
            </div>
        )

    }
}

export default Models