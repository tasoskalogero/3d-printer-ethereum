import encryptor from './encryptor';


export default async function postToDB(dataPayload) {

const driver = require('bigchaindb-driver')


const API_PATH = 'http://78.47.44.213:8209/api/v1/'


const user = new driver.Ed25519Keypair()

var encryptedFile = encryptor(dataPayload);


//Initialize the assetdata variable with the model_creator default to Dian
const assetdata = {
        'model': {
                'model_creator': 'Dian Balta'
        }
}
assetdata.model.encrypted_model = encryptedFile; //Possibly need to change the input payload to BCDB

//assetdata.model.printed_model = dataPayload;

const metadata = {'model_description': 'chair'}

// Construct a transaction payload
const txCreateUserSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(user.publicKey))
        ],
        user.publicKey
)


const txCreateSimpleSigned = driver.Transaction.signTransaction(txCreateUserSimple, user.privateKey)
// Send the transaction off to BigchainDB
const conn = new driver.Connection(API_PATH)

var txid = await conn.postTransaction(txCreateSimpleSigned);

var retrievedTx = await conn.pollStatusAndFetchTransaction(txCreateSimpleSigned.id);
console.log('Transaction', retrievedTx.id, 'successfully posted.');
var status = await conn.getStatus(txCreateSimpleSigned.id);
var assets = await conn.searchAssets(txCreateSimpleSigned.id);

return retrievedTx.id;


}