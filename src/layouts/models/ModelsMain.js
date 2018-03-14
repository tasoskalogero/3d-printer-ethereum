import React, { Component } from 'react'
import PurchasedModels from "./PurchasedModels";
import RegisteredModels from "./RegisteredModels";
import UploadedCopies from "./UploadedCopies";

class Models extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <RegisteredModels/>
                <PurchasedModels/>
                <UploadedCopies/>
            </div>
        )

    }
}

export default Models