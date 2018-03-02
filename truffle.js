module.exports = {
    networks: {
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        },
        //--------------------------- Copy these and add them to the truffle.js of your project --------------------------------
        //****************** This is the configuration for FortissTestNet - Only deploy the final tested project here **********
        //---------------------------------- Always request for the miners to be started ---------------------------------------
        fortiss: {
            host: "78.47.44.213",
            port: 8204,
            network_id: 1234,
            gas: 4712388,
            gasPrice: 6500000000000
        },
        //******************This is ganache CLI running on Fortiss server, can be used for development purpose ******************
        fortissGanache: {
            host: "78.47.44.213",
            port: 8206,
            network_id: 1235,
            gas: 4712388,
            gasPrice: 6500000000000
        }
    }
};
