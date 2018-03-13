import React from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import masterAssetBigchain from "../dashboard/masterAssetBigchain";

const contract = require('truffle-contract');

class FileUploadButton extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null,
            masterModelID: '',
            purchaseID: ''
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault();
        console.log(this.state.file);
        this.uploadCopy();
    }
    onChange(e) {
        this.setState({
            file:e.target.files[0],
            masterModelID:  this.props.masterModelID,
            purchaseID: this.props.purchaseID})
    }

    async uploadCopy() {

        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);

        let currentAddress = web3Inst.eth.coinbase;
        let instance = await authContract.deployed();

        let masterModelDetails = await instance.getMasterModelDetails.call(this.state.masterModelID, {from: currentAddress});

        let copyModelName = web3Inst.toUtf8(masterModelDetails[0]) + "_Copy";
        let copyModeldescription = masterModelDetails[3];
        let copyModelCost = web3Inst.fromWei(masterModelDetails[4]);

        console.log("UPLOAD COPY FOR: " , this.state.masterModelID);
        console.log(copyModelName);
        console.log(copyModeldescription);
        console.log(copyModelCost);

        // Upload BCDB
        let txID = await masterAssetBigchain(this.state.file, copyModelName, copyModeldescription, copyModelCost, currentAddress);

        let success = await instance.newModelCopy(this.state.masterModelID, this.state.purchaseID, txID, {from: currentAddress});
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