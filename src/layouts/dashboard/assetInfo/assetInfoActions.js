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

export function updateValues(modelname, description, cost, bcdbTxID) {
  let web3 = store.getState().web3.web3Instance;

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract);
      authentication.setProvider(web3.currentProvider);

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance;

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
        authenticationInstance = instance;
                    // Attempt to login user.

          
          authenticationInstance.newModel(modelname, description, web3.toWei(cost), bcdbTxID, {from: coinbase, gas: 3000000, value:300})
          .then(function(result) {

            dispatch(costUpdated({"modelname":modelname, "description":description, "cost": cost}));
            
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
