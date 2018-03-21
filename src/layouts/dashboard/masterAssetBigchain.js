import encryptor from './encryptor';


export default async function postToDB(dataPayload, mdName, mdDescr, mdCost, owner) {

    const driver = require('bigchaindb-driver');


    const API_PATH = 'http://78.47.44.213:8209/api/v1/';
    // const API_PATH = 'http://localhost:59984/api/v1/';           # Local instance of BigchainDB running in Docker

    const user = new driver.Ed25519Keypair();

    let encryptedFile = encryptor(dataPayload);

    //Initialize the assetdata variable with the model_creator default to Dian
    let assetdata = { model: {encrypted_model:''}};
    assetdata.model.encrypted_model = encryptedFile; //Possibly need to change the input payload to BCDB

    const metadata = {
        'modelName': mdName,
        'modelDescr': mdDescr,
        'modelCost': mdCost,
        'owner': owner
    };

    try{
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
        return [0,retrievedTx.id];
    }catch (e) {
        console.log(e);
        return [1,e.message];
    }


}