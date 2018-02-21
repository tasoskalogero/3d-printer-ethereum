import React, { Component } from 'react'
import FileUpload from '../FileUpload'

class AssetInfo extends Component {
  constructor(props, {authData}) {
    super(props)

    
    //console.log(this.props.authData.name);
    this.state = {
      modelname: this.props.modelname,
      transactionid: '',
      description: this.props.description,
      cost: this.props.cost
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

  handleSubmit(event) {
    event.preventDefault()

    this.props.onAssetFormSubmit(this.state.modelname, this.state.description, this.state.cost)
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <label htmlFor="ModelName">Name of Model</label>
          <input id="modelname" type="text" value={this.state.modelname} onChange={this.onInputChangeModelName.bind(this)} placeholder="Please name your model" />
          <label htmlFor="description">Describe Your Model</label>
          <input id="description" type="text" value={this.state.description} onChange={this.onInputChangeDescription.bind(this)} placeholder="Enter a description" />

          <label htmlFor="cost">Cost in Ether</label>
          <input id="cost" type="number" step="0.01" value={this.state.cost} onChange={this.onInputChangeCost.bind(this)} />

          <span className="pure-form-message">This is a required field.</span>

          <br />

          <button type="submit" className="pure-button pure-button-primary">Submit Model</button>
        </fieldset>
      </form>
    )
  }
}

export default AssetInfo
