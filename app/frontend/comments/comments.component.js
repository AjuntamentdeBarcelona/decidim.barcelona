import { Component }                         from 'react';
import { connect }                           from 'react-redux';
import { bindActionCreators }                from 'redux';

import { fetchComments, appendCommentsPage } from './comments.actions';

import Loading                               from '../application/loading.component';
import InfinitePagination                    from '../pagination/infinite_pagination.component';
import CommentsOrderSelector                 from './comments_order_selector.component';
import Comment                               from './comment.component';
import NewCommentForm                        from './new_comment_form.component';

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  componentWillReceiveProps(newProps) {
    const { order, commentable, fetchComments } = this.props;

    if (order !== newProps.order) {
      this.setState({ loading: true });
      fetchComments(commentable, { order: newProps.order } ).then(() => {
        this.setState({ loading: false });
      });
    }
  }

  render() {
    const { commentable } = this.props;

    return (
      <section className="row-full comments">
        <div className="row">
          <div id="comments" className="small-12 column">
            <div className="row">
              <h2 className="small-12 medium-8 column">
                {`${I18n.t("proposals.show.comments_title")} `}
                ({this.renderSummary()})
              </h2>
              <CommentsOrderSelector />
            </div>
            <NewCommentForm 
              commentable={commentable}
              visible={commentable.permissions.comment} />
            <div className="comments_list">
              <Loading show={this.state.loading} />
              {this.renderComments()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderSummary() {
    const { commentable } = this.props;

    if (commentable.arguable) {
      return (
        <span>
          {I18n.t('comments.form.alignment.positive')}:
          <span className="js-comments-count positive">
          {` ${commentable.total_positive_comments}`}
          </span>,
          {` ${I18n.t('comments.form.alignment.negative')}`}: 
          <span className="js-comments-count negative">
          {` ${commentable.total_negative_comments}`}
          </span>,
          {` ${I18n.t('comments.form.alignment.neutral')}`}: 
          <span className="js-comments-count neutral">
          {` ${commentable.total_neutral_comments}`}
          </span>
        </span>
      );
    } else {
      return (
        <span>{commentable.total_comments}</span>
      );
    }
  }

  renderComments() {
    const { commentable } = this.props;
    const comments = this.flattenComments(this.props.comments);

    if (!this.state.loading && comments && comments.length > 0) {
      return (
        <div>
          {
            comments.map(comment => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                commentable={commentable} />
            ))
          }
          {this.renderInfinitePagination()}
        </div>
      );
    }

    return null;
  }

  flattenComments(comments) {
    if (comments) {
      let rootComments = comments
            .filter(c => c.ancestry === null)
            .map(c => { return { ...c }}),
          childComments = comments
            .filter(c => c.ancestry !== null)
            .map(c => { return { ...c }});

      childComments.forEach(c => {
        let ancestry = c.ancestry.split("/"),
            comment;

        if(ancestry.length > 1) {
          ancestry = ancestry.pop();
          comment = childComments.filter(c => c.id === parseInt(ancestry))[0];
        } else {
          ancestry = ancestry[0];
          comment = rootComments.filter(c => c.id === parseInt(ancestry))[0];
        }

        if (!comment.children) {
          comment.children = [];
        }

        comment.children.push(c);
      });

      return rootComments;
    }
  }

  renderInfinitePagination() {
    const { commentable, order, pagination, appendCommentsPage } = this.props;

    let infinitePaginationActive = !this.state.loading && pagination.current_page < pagination.total_pages;

    if (infinitePaginationActive) {
      return (
        <InfinitePagination 
          onVisible={() => appendCommentsPage(commentable, { 
            page: pagination.current_page + 1,
            order
          })} /> 
      );
    }

    return null;
  }
}

function mapStateToProps(state, { commentable }) {
  const resource = state[commentable.type.toLowerCase()];
  const comments = resource && resource.comments;

  return { 
    pagination: state.pagination,
    order: state.order,
    comments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchComments, appendCommentsPage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);