import { Component, PropTypes } from 'react';
import { connect }              from 'react-redux';

import FilterOptionGroup        from './filter_option_group.component';
import FilterOption             from './filter_option.component';

import * as actions             from './filters.actions';

class ReviewerFilter extends Component {
  render() {
    if (this.props.session.is_reviewer) {
      return (
        <div>
          <FilterOptionGroup 
            isExclusive={true}
            filterGroupName="reviewer_status" 
            filterGroupValue={this.props.filters.filter["reviewer_status"]}
            onChangeFilterGroup={(name, value) => this.props.setFilterGroup(name, value) }>
            <FilterOption filterName="reviewed" />
            <FilterOption filterName="not_reviewed" />
          </FilterOptionGroup>

          <FilterOptionGroup 
            isExclusive={true}
            filterGroupName="review_validation"
            filterGroupValue={this.props.filters.filter["review_validation"]}
            onChangeFilterGroup={(name, value) => this.props.setFilterGroup(name, value) }>
            <FilterOption filterName="validated" />
            <FilterOption filterName="not_validated" />
          </FilterOptionGroup>

          <FilterOptionGroup 
            isExclusive={true}
            filterGroupName="action_plan"
            filterGroupValue={this.props.filters.filter["action_plan"]}
            onChangeFilterGroup={(name, value) => this.props.setFilterGroup(name, value) }>
            <FilterOption filterName="with_action_plan" />
            <FilterOption filterName="without_action_plan" />
          </FilterOptionGroup>
        </div>
      );
    }
    return null;
  }
}

export default connect(
  ({ filters, session }) => ({ filters, session }),
  actions
)(ReviewerFilter);

ReviewerFilter.propTypes = {
  session: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  setFilterGroup: PropTypes.func.isRequired
};
