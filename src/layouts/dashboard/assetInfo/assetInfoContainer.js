import { connect } from 'react-redux'
import AssetInfo from './assetInfo'
import { updateCost } from './assetInfoActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.user.data.name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAssetFormSubmit: (cost) => {
      event.preventDefault();

      dispatch(updateCost(cost))
    }
  }
}

const AssetInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetInfo)

export default AssetInfoContainer
