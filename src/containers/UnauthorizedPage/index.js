import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { getRenderingHeader } from '../../common/helpers';
import { updateAdminPermissions } from '../../actions/AuthActions';
import requireAuth from '../../hoc/requireAuth';
import AdminService from '../../service/AdminService';
import styles from './unauthorized-page.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

class UnauthorizedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.adminService = new AdminService();
  }

  componentDidMount() {
    this.adminService
      .getSelfPermissions()
      .then((responseData) => {
        if (responseData.data) {
          this.props.updateAdminPermissions(responseData.data);
        }
      })
      .catch((errorData) => {
        console.log(errorData);
      });
  }

  render() {
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            'dashboard-page sidebar-page unauthorized-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          <main className='sidebar-page-wrapper'>
            <div className='internal-header'>
              <div className='internal-header-left'>
                <h1>
                  <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
                  Access Denied
                </h1>
              </div>
            </div>
            <div className='internal-content'>
              <div className='internal-content-header text-center'>
                <Link to={ROUTES.DASHBOARD} className='btn btn-link'>
                  Go To Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  updateAdminPermissions,
};

export default requireAuth(
  connect(mapStateToProps, mapDispatchToProps)(UnauthorizedPage)
);
