import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as SearchActions from 'actions/search-actions';

class Settings extends Component {

  static propTypes = {settings: React.PropTypes.object};

  render() {
    const {actions} = this.props;

    return (
      <div>
        <h1>Settings</h1>
      </div>
    );
  }
}

function mapState(state) {
  console.log(state);
  return {};
  // return {
  //   ips: state.search.ips,
  //   status: state.search.status
  // };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(SearchActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(Settings);