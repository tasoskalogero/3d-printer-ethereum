import { connect } from 'react-redux'
import AssetInfo from './assetInfo'
import { updateCost } from './assetInfoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    modelname: state.user.data.modelname,
    description: state.user.data.description,
    cost: state.user.data.cost

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAssetFormSubmit: (modelname, description, cost) => {
      
      //event.preventDefault();

      dispatch(updateCost(modelname, description, cost))
    }
  }
}

const AssetInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetInfo)

export default AssetInfoContainer
