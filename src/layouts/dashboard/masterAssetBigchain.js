import encryptor from './encryptor';


export default async function postToDB(dataPayload, mdName, mdDescr, mdCost, owner) {

const driver = require('bigchaindb-driver');


const API_PATH = 'http://78.47.44.213:8209/api/v1/';
// const API_PATH = 'http://localhost:59984/api/v1/';


const user = new driver.Ed25519Keypair();

    // console.log("STORING IN BCDB");
    // console.log(dataPayload);
    // console.log(mdName);
    // console.log(mdDescr);
    // console.log(mdCost);
    // console.log(owner);

    let encryptedFile = encryptor(dataPayload);


//Initialize the assetdata variable with the model_creator default to Dian
let assetdata = { model: {encrypted_model:''}};
assetdata.model.encrypted_model = encryptedFile; //Possibly need to change the input payload to BCDB

//assetdata.model.printed_model = dataPayload;

const metadata = {
    'modelName': mdName,
    'modelDescr': mdDescr,
    'modelCost': mdCost,
    'owner': owner
};

// Construct a transaction payload
const txCreateUserSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(user.publicKey))
        ],
        user.publicKey
);


const txCreateSimpleSigned = driver.Transaction.signTransaction(txCreateUserSimple, user.privateKey);
// Send the transaction off to BigchainDB
const conn = new driver.Connection(API_PATH);

await conn.postTransaction(txCreateSimpleSigned);

let retrievedTx = await conn.pollStatusAndFetchTransaction(txCreateSimpleSigned.id);
console.log('Transaction', retrievedTx.id, 'successfully posted.');

return retrievedTx.id;


}