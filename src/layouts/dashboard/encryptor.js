export default function fileEncrypt(file, asset_type) {

var CryptoJS = require("crypto-js");
 
var data = file;

var seed = 'PAUL9NOZTUVHPBKLTFVRJZTOPODGTYHRUIACDYDKRNAQMCUZGNWMDSDZMPWHKQINYFPYTIEDSZ9EJZYOD';
 
// Encrypt 
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), seed);
 //Passphrase is a 82 character random string.
 //TODO: Have this as a variable separating the OTP and master asset.


// Decrypt 
//var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), seed);
//var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
var cipherArray = [ciphertext, seed];//Need to return 2 values from function so put them into an array


	return cipherArray; //Need to also return the original encrypted key
}