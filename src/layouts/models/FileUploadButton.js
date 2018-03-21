import React from 'react'
import store from "../../store";
import AuthenticationContract from '../../../build/contracts/Authentication';
import masterAssetBigchain from "../dashboard/masterAssetBigchain";
import generateCS from "./ChecksumGenerator";

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

    async onFormSubmit(e){
        e.preventDefault();
        let web3Inst = store.getState().web3.web3Instance;
        const authContract = contract(AuthenticationContract);
        authContract.setProvider(web3Inst.currentProvider);
        let currentAddress = web3Inst.eth.coinbase;
        let instance = await authContract.deployed();

        if(this.state.file === null)
            return alert("File is missing");

        let checksum = await generateCS(this.state.file);
        let masterModel = await instance.getMasterModelDetails.call(this.state.masterModelID, {from: currentAddress});
        let masterChecksum = masterModel[6];
        if (masterChecksum !== checksum)
            return alert("Wrong checksum.");

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

        console.log("Uploaded copy file for: " , this.state.masterModelID);

        let result = await masterAssetBigchain(this.state.file, copyModelName, copyModeldescription, copyModelCost, currentAddress);
        if(result[0] === 1) {
            return alert("BigchainDB error - " + result[1]);
        }
        let txID = result[1];

        let success = await instance.newModelCopy(this.state.masterModelID, this.state.purchaseID, txID, {from: currentAddress});
        this.props.onNewCopyUpload();
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