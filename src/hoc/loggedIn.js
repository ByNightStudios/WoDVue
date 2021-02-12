import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React from 'react';

export default (ChildComponent) => {
  class loggedIn extends React.Component {
    render() {
      let is_logged_in = this.props.user.is_logged_in;
      if (is_logged_in) {
        return <Redirect to='/dashboard' />;
      }

      return <ChildComponent />;
    }
  }

  const mapStateToProps = (state) => ({
    user: state.user,
  });

  return connect(mapStateToProps, {})(loggedIn);
};
