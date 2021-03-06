import { Component, PropTypes }                                    from 'react';
import {
  createStore,
  applyMiddleware,
  combineReducers
}                                                                  from 'redux';
import { Provider }                                                from 'react-redux';
import ReduxPromise                                                from 'redux-promise';
import ReduxThunk                                                  from 'redux-thunk';

const middlewares = [ReduxPromise, ReduxThunk];

// if (process.env.NODE_ENV === 'development') {
//   const createLogger = require('redux-logger');
//   const logger = createLogger();
//   middlewares.push(logger);
// }

import Meetings                                                    from './meetings.component';

import {
  FETCH_MEETINGS,
  APPEND_MEETINGS_PAGE
}                                                                  from './meetings.actions';

import { defaultDateFilter, meetings, visibleMeetings, PER_PAGE }  from './meetings.reducers';
import districts                                                   from '../districts/districts.reducers';
import categories                                                  from '../categories/categories.reducers';
import filters                                                     from '../filters/filters.reducers';

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const pagination = function (state = {}, action) {
  let meetings, totalPages, nextPage;

  switch (action.type) {
    case FETCH_MEETINGS:
      meetings = action.payload.data.meetings;
      totalPages = Math.ceil(meetings.length / PER_PAGE);

      return {
        current_page: 1,
        next_page: totalPages > 1 ? 2 : null,
        prev_page: null,
        total_pages: totalPages,
        total_count: meetings.length
      }
    case APPEND_MEETINGS_PAGE:
      nextPage = action.page;

      return {
        ...state,
        current_page: nextPage,
        next_page: nextPage < state.total_pages ? nextPage + 1 : null,
        prev_page: state.current_page 
      }
  }
  return state;
}

const tags = function (state = [], action) {
  switch (action.type) {
    case FETCH_MEETINGS:
      return action.payload.data.meta.tag_cloud
  }
  return state;
}

function createReducers(sessionState, participatoryProcessState, decidimIconsUrlState) {
  let session = function (state = sessionState) {
    return state;
  };

  let participatoryProcess = function (state = participatoryProcessState) {
    return state;
  };

  let decidimIconsUrl = function (state = decidimIconsUrlState) {
    return state;
  };

  return combineReducers({
    session, 
    participatoryProcess,
    decidimIconsUrl,
    districts,
    categories,
    defaultDateFilter,
    meetings,
    visibleMeetings,
    filters,
    pagination,
    tags
  });
}

export default class MeetingsApp extends Component {
  render() {
    return (
      <Provider 
        store={createStoreWithMiddleware(createReducers(this.props.session, this.props.participatory_process, this.props.decidim_icons_url))}>
        <Meetings />
      </Provider>
    );
  }
}

MeetingsApp.propTypes = {
  session: PropTypes.object.isRequired,
  participatory_process: PropTypes.object.isRequired,
  decidim_icons_url: PropTypes.string.isRequired
};
