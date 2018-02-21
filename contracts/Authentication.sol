pragma solidity ^0.4.2;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
  struct User {
    bytes32 name;
  }
  mapping (address => User) private users;

  struct Model {
    bytes32 modelname;
    bytes32 name;
    address modeladdress;
    bytes32 description;
    uint cost;
  }

  
  Model[] public models;


  

  uint private id; // Stores user id temporarily

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


  function newModel(bytes32 modelname, bytes32 description, uint cost)
  public
  payable
  onlyExistingUser
  returns (uint modelID) {
        models.length++;
        models[models.length-1].modelname = modelname;
        models[models.length-1].name = users[msg.sender].name;
        models[models.length-1].modeladdress = msg.sender;
        models[models.length-1].description = description;
        models[models.length-1].cost = cost;
        
        return models.length;
    }


function getModelCount()
public
constant
returns (uint) {
  return models.length;
}

function getModel(uint index)
public
constant
onlyExistingUser
returns (bytes32, bytes32, address, bytes32, uint) {
  
    return (models[index].modelname, models[index].name, models[index].modeladdress, models[index].description, models[index].cost);
  }

function purchase(uint index)
public
payable
onlyExistingUser
returns (bool) {

if (models[index].cost > 0) {
  address designer = models[index].modeladdress;
  designer.transfer(models[index].cost);

  return true;
    }
  }

}