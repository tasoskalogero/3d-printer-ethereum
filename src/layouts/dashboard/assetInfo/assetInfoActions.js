import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const USER_UPDATED = 'USER_UPDATED'
function costUpdated(model) {
  return {
    type: USER_UPDATED,
    payload: model,
  }
}

export function updateCost(modelname, description, cost) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
        authenticationInstance = instance
                    // Attempt to login user.

          
          authenticationInstance.newModel(modelname, description, cost, {from: coinbase, gas: 3000000})
          .then(function(result) {
            // If no error, update user.
          
            dispatch(costUpdated({"modelname":modelname, "description":description, "cost": cost}))
            
            console.log(result);
            return alert('Thank you, your model has been stored')
            

          })
          .catch(function(result) {
            // If error...
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
