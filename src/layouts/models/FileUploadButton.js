import React from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import masterAssetBigchain from "../dashboard/masterAssetBigchain";

const contract = require('truffle-contract')

class FileUploadButton extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null,
            model: ''
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault();
        console.log(this.state.file);
        this.uploadCopy(this.state.file, this.state.model);
    }
    onChange(e) {
        this.setState({file:e.target.files[0], model:  this.props.modelToUpload})
    }

    async uploadCopy(fileToUpload, modelDetails) {

        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        //
        authContract.setProvider(web3Inst.currentProvider);
        let currentAddress = web3Inst.eth.coinbase;
        let instance = await authContract.deployed();
        //
        // let retrievedModel = await instance.getModelDetails.call(this.state.modelId, {from: currentAddress});
        let modelName = modelDetails.modelName;
        let description = modelDetails.description;
        let cost = modelDetails.cost;

        console.log(modelName);
        console.log(description);
        console.log(cost);

        // Upload BCDB
        let txID = await masterAssetBigchain(fileToUpload, modelName, description, cost, currentAddress);
        let success = await instance.newModelCopy(modelDetails.modelId, txID, {from: currentAddress});
        console.log('Uploaded: ',success);
        return alert('Thank you, your model has been stored')

    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input type="file" onChange={this.onChange} />
                <button type="submit" className="pure-button pure-button-primary" >Upload Copy</button>
            </form>
        )
    }
}

export default FileUploadButton