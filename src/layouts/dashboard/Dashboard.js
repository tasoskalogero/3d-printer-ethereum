import React, { Component } from 'react'
import AssetInfoContainer from './assetInfo/assetInfoContainer';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> You are now logged in. If you have a 3D Model you would like to add, please upload it below:</p>
          </div>
        </div>
        <div>
        <AssetInfoContainer/>
        </div>

      </main>
    )
  }
}

export default Dashboard
