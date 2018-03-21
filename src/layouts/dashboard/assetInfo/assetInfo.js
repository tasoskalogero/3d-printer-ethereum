import React, { Component } from 'react'
import FileUpload from '../FileUpload'
import masterAssetBigchain from '../masterAssetBigchain';
import store from "../../../store";

class AssetInfo extends Component {
  constructor(props, {authData}) {
    super(props);

    this.state = {
        uploadedFile: '',
        modelname: '',
        transactionid: '',
        description: '',
        cost: '',
        bcdbTxID: '',
    }
  }

  onInputChangeCost(event) {
    this.setState({ 
                    cost: event.target.value
                     })
  }
    onInputChangeModelName(event) {
    this.setState({ 
                    modelname: event.target.value,
                     })
  }
    onInputChangeDescription(event) {
    this.setState({ 
                    
                    description: event.target.value,
                    
                     })
  }

  async handleSubmit(event) {
    event.preventDefault();
    let web3 = store.getState().web3.web3Instance;
    let owner = web3.eth.coinbase;

    if(this.state.uploadedFile === '')
        return alert("File is missing");
    if(this.state.modelname=== '')
        return alert("Filename is missing");
    if(this.state.description === '')
        return alert("Description is missing");
    if(this.state.cost === '')
        return alert("Cost is missing");

    let result = await masterAssetBigchain(this.state.uploadedFile, this.state.modelname, this.state.description, web3.toWei(this.state.cost), owner);
    if(result[0] === 1) {
        return alert("BigchainDB error - " + result[1]);
    }
    this.setState({bcdbTxID: result[1]});
    this.props.onAssetFormSubmit(this.state.modelname, this.state.description, this.state.cost, this.state.bcdbTxID)
  }

    uploadFileCallback = (dataFromFileUpload) => {
      this.setState({uploadedFile: dataFromFileUpload });
  };

  render() {
    return(
        <div>
            <FileUpload callbackFromParent={this.uploadFileCallback}/>
              <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                  <label htmlFor="ModelName">Name of Model</label>
                  <input id="modelname" type="text" value={this.state.modelname} onChange={this.onInputChangeModelName.bind(this)} placeholder="Please name your model" />
                  <label htmlFor="description">Describe Your Model</label>
                  <input id="description" type="text" value={this.state.description} onChange={this.onInputChangeDescription.bind(this)} placeholder="Enter a description" />
                  <label htmlFor="cost">Cost (ETH)</label>
                  <input id="cost" type="number" min="0" step="0.01" value={this.state.cost} onChange={this.onInputChangeCost.bind(this)} />
                  <span className="pure-form-message">This is a required field.</span>
                  <br />
                  <button type="submit" className="pure-button pure-button-primary">Submit Model</button>
                </fieldset>
              </form>
        </div>
    )
  }
}

export default AssetInfo
