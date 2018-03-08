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

    struct Model {
        bytes32 modelId;            //keccak(modelname,description,bcdbTxID)
        bytes32 modelname;
        bytes32 name;
        address owner;
        string description;
        uint cost;          //in wei
        string bcdbTxID;
        address buyer;
    }

    bytes32[] modelIdentifiers;
    //modelId => model
    mapping(bytes32 => Model) allModels;

    struct ModelCopy {
        bytes32 modelID;
        bytes32 masterModelID;
        string bcdbTxID;
        bool uploadExists;
    }

    bytes32[] modelCopyIdentifiers;
    //modelId => ModelCopy
    mapping(bytes32 => ModelCopy) allModelsCopies;

    struct PurchaseInventory {
        //modelId => cost
        mapping(bytes32 => uint) completedPurchases;
    }

    bytes32[] purchasedModelIds;
    //user => PurchaseInventory
    mapping(address => PurchaseInventory) purchases;


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

        if (users[msg.sender].name == 0x0)
        {
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
        if (users[msg.sender].name != 0x0)
        {
            users[msg.sender].name = name;
            return (users[msg.sender].name);
        }
    }


    function newModel(bytes32 modelname, string description, uint cost, string bcdbTxID)
    public
    payable
    onlyExistingUser
    returns (bool success) {
        bytes32 id = keccak256(modelname,description,bcdbTxID);
        modelIdentifiers.push(id);

        allModels[id].modelId= id;
        allModels[id].modelname = modelname;
        allModels[id].name = users[msg.sender].name;
        allModels[id].owner = msg.sender;
        allModels[id].description = description;
        allModels[id].cost = cost;
        allModels[id].bcdbTxID = bcdbTxID;
        return success;
    }

    function newModelCopy(bytes32 _id, string _bcdbTxId) public returns(bool success){

        modelCopyIdentifiers.push(_id);
        allModelsCopies[_id].modelID = _id;
        allModelsCopies[_id].bcdbTxID = _bcdbTxId;
        allModelsCopies[_id].uploadExists = true;
        return true;
    }


    function getModelIdentifiers() public view returns (bytes32[]) {
        return modelIdentifiers;
    }

    function getModelCopyIdentifiers() public view returns (bytes32[]) {
        return modelCopyIdentifiers;
    }

    function getModelDetails(bytes32 id) public view onlyExistingUser
        returns (bytes32, bytes32, address, string, uint, string, address) {

        return (
        allModels[id].modelname,
        allModels[id].name,
        allModels[id].owner,
        allModels[id].description,
        allModels[id].cost,
        allModels[id].bcdbTxID,
        allModels[id].buyer);
    }

    function getModelCopyDetails(bytes32 id) public view onlyExistingUser
    returns(string, bool) {
        return (allModelsCopies[id].bcdbTxID,allModelsCopies[id].uploadExists);
    }

    function purchase(bytes32 id) public payable onlyExistingUser returns (bool) {
        require(msg.sender.balance >= allModels[id].cost);
        require(allModels[id].cost > 0);

        allModels[id].buyer = msg.sender;
        purchases[msg.sender].completedPurchases[id] = msg.value;
        purchasedModelIds.push(id);

        return true;
    }

    function getPurchasedModelIds() public view returns(bytes32[]) {
        return purchasedModelIds;
    }

    function executeTransfer(address from, address toAddr, bytes32 id) public returns(bool){
        toAddr.transfer(purchases[from].completedPurchases[id]);
        return true;

    }
}