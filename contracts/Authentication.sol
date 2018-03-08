pragma solidity ^0.4.19;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
    struct User {
        bytes32 name;
    }

    mapping(address => User) private users;

    struct Model {
        bytes32 modelId;            //keccak modelname,description,bcdbTxID
        bytes32 modelname;
        bytes32 name;
        address owner;
        string description;
        uint cost;          //in wei
        string bcdbTxID;
        bool bought;
    }

    bytes32[] modelIdentifiers;
    mapping(bytes32 => Model) modelInventory;

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

        modelInventory[id].modelId= id;
        modelInventory[id].modelname = modelname;
        modelInventory[id].name = users[msg.sender].name;
        modelInventory[id].owner = msg.sender;
        modelInventory[id].description = description;
        modelInventory[id].cost = cost;
        modelInventory[id].bcdbTxID = bcdbTxID;
        return success;
    }


    function getIdentifiers() public view returns (bytes32[]) {
        return modelIdentifiers;
    }

//    function getModelOwnerDetails(bytes32 id) public view onlyExistingUser
//        returns(bytes32, address) {
//        return (
//            ;
//    }

    function getModelDetails(bytes32 id) public view onlyExistingUser
        returns (bytes32, bytes32, address, string, uint, string, bool) {

        return (
        modelInventory[id].modelname,
        modelInventory[id].name,
        modelInventory[id].owner,
        modelInventory[id].description,
        modelInventory[id].cost,
        modelInventory[id].bcdbTxID,
        modelInventory[id].bought);
    }

    function purchase(bytes32 id) public payable onlyExistingUser returns (bool) {
        //TODO check msg.sender balance and correct index
        if (modelInventory[id].cost > 0) {
            address designer = modelInventory[id].owner;
            designer.transfer(modelInventory[id].cost);
            modelInventory[id].bought = true;
            //Purchase(index);
            return true;
        }

    }
}