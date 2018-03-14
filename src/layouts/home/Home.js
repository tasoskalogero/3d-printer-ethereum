import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome!</h1>
            <p>This is the 3D Printer decentralized application for secure sharing of various 3D Models.</p>
            <h2>Using the App</h2>
            <p>You will first need to have Metamask installed and linked to your Ethereum address. This is how the application will validate you. Simply click on 'Sign Up' and register with your username, which will link your choice to your public ethereum address. From here, you can upload your 3D models if you are a designer or purchase 3D models that were previously uploaded.</p>
            {/*<h3>Accessing User Data</h3>*/}
            {/*<p>Once authenticated, any component can access the user's data by assigning the authData object to a component's props.<br/><code>{"// In component's render function."}<br/>{"const { authData } = this.props"}<br/><br/>{"// Use in component."}<br/>{"Hello { this.props.authData.name }!"}</code></p>            */}
          </div>
        </div>
      </main>
    )
  }
}

export default Home
