import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as SearchActions from 'actions/search-actions';
import HeatMap from 'components/map';
import {PENDING} from 'constants/api-status';

class MapApp extends Component {

  static propTypes = {ips: React.PropTypes.array};
  static defaultProps = {ips: []};
  
  render() {
    const {actions, ips, status} = this.props;

    return (
      <div>
        <HeatMap points={ips} search={actions.search}/>
      </div>
    );
  }
}

function mapState(state) {
  return {
    ips: state.search.ips,
    status: state.search.status
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(SearchActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(MapApp);













