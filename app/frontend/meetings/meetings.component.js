import { Component, PropTypes }              from 'react';
import { connect }                           from 'react-redux';

import Loading                               from '../application/loading.component';
import InfinitePagination                    from '../pagination/infinite_pagination.component';
import MeetingsMap                           from './meetings_map.component';
import MeetingsFilters                       from './meetings_filters.component';
import MeetingsList                          from './meetings_list.component';

import { fetchMeetings, appendMeetingsPage } from './meetings.actions';
import { setFilterGroup }                    from '../filters/filters.actions';

class Meetings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.fetchMeetings({ filters: this.props.filters });
  }

  componentWillReceiveProps({ defaultDateFilter, filters }) {
    if (defaultDateFilter && !filters.filter["date"]) {
      this.props.setFilterGroup("date", [defaultDateFilter]);
    } else {
      if (this.props.filters !== filters) {
        this.setState({ loading: true });
        this.props.fetchMeetings({ filters });
      } else {
        this.setState({ loading: false });
      }
    }
  }

  render () {
    return (
      <div style={{ position: 'relative' }} className="meetings-directory">
        <Loading show={this.state.loading} />
        <div className="row column">
          <MeetingsMap className="meetings-map" meetings={this.props.meetings} />
        </div>

        <div className="row meetings-directory-content">
          <div className="columns mediumlarge-4 large-3">
            <div className="card card--secondary show-for-mediumlarge">
              <div className="filters">
                <MeetingsFilters />
              </div>
            </div>
          </div>

          <div className="columns mediumlarge-8 large-9 meetings-list-container">
            <div className="meetings-list">
              <MeetingsList meetings={this.props.visibleMeetings} />
              {this.renderInfinitePagination()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderInfinitePagination() {
    let infinitePaginationActive = !this.state.loading && 
      this.props.pagination.current_page < this.props.pagination.total_pages;

    if (infinitePaginationActive) {
      return (
        <InfinitePagination 
          onVisible={() => this.props.appendMeetingsPage({ 
            page: this.props.pagination.current_page + 1
          })} /> 
      );
    }

    return null;
  }
}

export default connect(
  ({ defaultDateFilter, meetings, visibleMeetings, filters, pagination }) => (
    { defaultDateFilter, meetings, visibleMeetings, filters, pagination }
  ),
  {
    fetchMeetings,
    appendMeetingsPage,
    setFilterGroup
  }
)(Meetings);

Meetings.propTypes = {
  filters: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  defaultDateFilter: PropTypes.string,
  meetings: PropTypes.array.isRequired,
  visibleMeetings: PropTypes.array.isRequired,
  setFilterGroup: PropTypes.func.isRequired,
  fetchMeetings: PropTypes.func.isRequired,
  appendMeetingsPage: PropTypes.func.isRequired
};
