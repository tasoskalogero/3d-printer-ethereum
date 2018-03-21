import * as CryptoJS from 'crypto-js';

export default function generateCS(dataPayload) {
    return generateChecksum(dataPayload,getCS);
}

function generateChecksum(dataPayload, callback) {
    let reader = new FileReader();

    return new Promise((resolve, reject) => {

        reader.onload = function(event) {
            let binary = event.target.result;
            let sha256Hash = CryptoJS.SHA256(binary).toString();
            resolve(sha256Hash);
        };

        reader.readAsBinaryString(dataPayload);
    })
}

function getCS(cs) {
    return cs;
}
