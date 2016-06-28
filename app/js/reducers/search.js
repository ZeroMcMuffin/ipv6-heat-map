import {SEARCH} from 'constants/action-types';
import {PENDING, SYNCED, ERROR} from 'constants/api-status';

const initialState = {
  ips: [],
  settings: {}
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case SEARCH:
      let convertedArray = action.ips.map(item => {
        return [
          item.latitude,
          item.longitude,
          item.count,
          item.ips
        ];
      });
      return Object.assign({},
        state,
        { ips: convertedArray }
      );
      break;
    default:
      return state;
  }
}
