pragma solidity ^0.4.0;

contract ModelRegistry {

    struct ModelEntry {
        uint modelID;
        string modelName;
        uint cost;
        string description;
        string designerName;
    }

    // ID -> model object
    mapping(uint => ModelEntry) modelsList;
    uint public testID;

    function ModelRegistry() {
        testID = 5;
    }
    function createModel(
        uint _id,
        string _modelName,
        uint _cost,
        string _description,
        string _designerName)
    public
    returns(bool success) {
        modelsList[_id].modelID = _id;
        modelsList[_id].modelName = _modelName;
        modelsList[_id].cost = _cost;
        modelsList[_id].description = _description;
        modelsList[_id].designerName = _designerName;
        return true;
    }

    function getModel(uint _id)
    public
    view
    returns(string mdName, uint cost, string descr, string designerName){
        return(
        modelsList[_id].modelName,
        modelsList[_id].cost,
        modelsList[_id].description,
        modelsList[_id].designerName);
    }

}