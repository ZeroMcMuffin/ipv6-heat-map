'use strict';

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import DevTools from './dev-tools';
import Nav from 'components/nav';
import Map from 'containers/map';
import Settings from 'containers/settings';

// <div>
//   <MapApp />
//   <DevTools />
// </div>

export default class Root extends Component {
  render() {
    const {store} = this.props;
    const history = syncHistoryWithStore(browserHistory, store);

    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            <Route path="/" component={Nav}>
              <IndexRoute component={Map}/>
              <Route path="settings" component={Settings}/>
            </Route>
          </Router>
          <DevTools />
        </div>
      </Provider>
    );
  }
}
