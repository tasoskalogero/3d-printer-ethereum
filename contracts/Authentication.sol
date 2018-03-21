pragma solidity ^0.4.19;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
    modifier onlyExistingUser {
        // Check if user exists or terminate
        require(!(users[msg.sender].name == 0x0));
        _;
    }

    modifier onlyValidName(bytes32 name) {
        // Only valid names allowed
        require(!(name == 0x0));
        _;
    }

    struct User {
        bytes32 name;
    }
    mapping(address => User) private users;

    function login() constant
    public
    onlyExistingUser
    returns (bytes32) {
        return (users[msg.sender].name);
    }

    function signup(bytes32 name)
    public
    payable
    onlyValidName(name)
    returns (bytes32) {
        // Check if user exists.
        // If yes, return user name.
        // If no, check if name was sent.
        // If yes, create and return user.

        if (users[msg.sender].name == 0x0) {
            users[msg.sender].name = name;
            return (users[msg.sender].name);
        }
        return (users[msg.sender].name);
    }

    function update(bytes32 name)
    public
    payable
    onlyValidName(name)
    onlyExistingUser
    returns (bytes32) {
        // Update user name.
        if (users[msg.sender].name != 0x0) {
            users[msg.sender].name = name;
            return (users[msg.sender].name);
        }
    }

    //    ========================== MASTER MODEL ==========================

    struct MasterModel {
        bytes32 modelId;            //keccak(modelname,description,bcdbTxID)
        bytes32 modelname;
        bytes32 ownerName;
        address owner;
        string description;
        uint cost;          //in wei
        string bcdbTxID;
        string checksum;
    }

    bytes32[] masterModelIdentifiers;
    //modelId => model
    mapping(bytes32 => MasterModel) masterModels;

    function newModel(bytes32 modelname, string description, uint cost, string bcdbTxID, string checksum)
    public
    payable
    onlyExistingUser
    returns (bool success) {
        bytes32 id = keccak256(modelname,description,bcdbTxID);
        masterModelIdentifiers.push(id);

        masterModels[id].modelId= id;
        masterModels[id].modelname = modelname;
        masterModels[id].ownerName = users[msg.sender].name;
        masterModels[id].owner = msg.sender;
        masterModels[id].description = description;
        masterModels[id].cost = cost;
        masterModels[id].bcdbTxID = bcdbTxID;
        masterModels[id].checksum = checksum;
        return success;
    }

    function getModelIdentifiers() public view returns (bytes32[]) {
        return masterModelIdentifiers;
    }

    function getMasterModelDetails(bytes32 id) public view onlyExistingUser
    returns (bytes32, bytes32, address, string, uint, string, string) {

        return (
        masterModels[id].modelname,
        masterModels[id].ownerName,
        masterModels[id].owner,
        masterModels[id].description,
        masterModels[id].cost,
        masterModels[id].bcdbTxID,
        masterModels[id].checksum);
    }


    //    ========================== COPY MODEL ==========================
    struct ModelCopy {
        bytes32 copyModelID;
        bytes32 masterModelID;
        bytes32 purchaseID;
        string bcdbTxID;
        bool printed;
    }

    bytes32[] modelCopyIdentifiers;
    //modelId => ModelCopy
    mapping(bytes32 => ModelCopy) allModelsCopies;


    function newModelCopy(bytes32 _masterModelID, bytes32 _purchaseID, string _bcdbTxId) public returns(bool success){

        bytes32 cpID = keccak256(_masterModelID,_bcdbTxId); //maybe add "now"
        modelCopyIdentifiers.push(cpID );

        allModelsCopies[cpID].copyModelID = cpID;
        allModelsCopies[cpID].masterModelID = _masterModelID;
        allModelsCopies[cpID].purchaseID= _purchaseID;
        allModelsCopies[cpID].bcdbTxID = _bcdbTxId;
        allModelsCopies[cpID].printed = false;

        purchases[_purchaseID].uploaded = true;
        return true;
    }


    function getModelCopyIdentifiers() public view returns (bytes32[]) {
        return modelCopyIdentifiers;
    }

    function getModelCopyDetails(bytes32 id) public view onlyExistingUser
    returns(bytes32, bytes32, string, bool) {
        return (allModelsCopies[id].masterModelID,allModelsCopies[id].purchaseID, allModelsCopies[id].bcdbTxID, allModelsCopies[id].printed);
    }

    function setCopyModelPrinted(bytes32 cmID) public {
        require(msg.sender == 0x821aea9a577a9b44299b9c15c88cf3087f3b5544);        //only printer can change it
        allModelsCopies[cmID].printed = true;
    }

    //    ========================== PURCHASE ==========================

    struct PurchaseInventory {
        address buyer;
        address owner;
        bytes32 masterModelID;
        uint cost;
        bool uploaded;
        bool initialized;
    }

    bytes32[] purchaseIDs;
    //purchaseID=> PurchaseInventory
    mapping(bytes32 => PurchaseInventory) purchases;


    function newPurchase(bytes32 _masterModelID) public payable onlyExistingUser returns (bool) {
        require(msg.sender.balance >= masterModels[_masterModelID].cost);
        require(masterModels[_masterModelID].cost > 0);

        bytes32 purchaseID = keccak256(_masterModelID,msg.sender, now);
        purchaseIDs.push(purchaseID);

        purchases[purchaseID].buyer = msg.sender;
        purchases[purchaseID].owner = masterModels[_masterModelID].owner;
        purchases[purchaseID].masterModelID = _masterModelID;
        purchases[purchaseID].cost = msg.value;
        purchases[purchaseID].uploaded = false;
        purchases[purchaseID].initialized = true;
        return true;
    }

    function getPurchaseIDs() public view returns(bytes32[]) {
        return purchaseIDs;
    }

    function getPurchaseByID(bytes32 pID) public view returns(address, address, bytes32, uint, bool, bool) {
        return(
        purchases[pID].buyer,
        purchases[pID].owner,
        purchases[pID].masterModelID,
        purchases[pID].cost,
        purchases[pID].uploaded,
        purchases[pID].initialized);
    }

    function executeTransfer(bytes32 cmID, bytes32 pID, address owner) public returns(bool success){
        owner.transfer(purchases[pID].cost);
        allModelsCopies[cmID].printed = true;
        return true;
    }

}