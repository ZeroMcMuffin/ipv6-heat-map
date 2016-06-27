'use strict';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './dev-tools';
import MapApp from 'containers/map-app';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <MapApp />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
