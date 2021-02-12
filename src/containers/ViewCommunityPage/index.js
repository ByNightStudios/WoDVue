import React from 'react';
import { Button } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import { notification, Modal } from 'antd';
import { getCommunityPost } from './dataManager';
import hasPermission from '../../hoc/hasPermission';
import requireAuth from '../../hoc/requireAuth';
import styles from './view-community-page.scss';

const { confirm } = Modal;

class ViewCommunityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationDeployed: false,
      loader: false,
      data: null,
    };
    this.classToggle = '';
  }
  componentDidMount() {
    this.setState({ loader: true });
    document.title = 'Emoha Admin | View Community Feed';
    getCommunityPost(this.props.match.params.id)
      .then((result) => {
        console.log(result.data);
        this.setState({
          loader: false,
          data: result.data[0],
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };
  // onEditPost = () => {
  //   switch (this.state.data.category_type) {
  //     case 1: {
  //       let url = ROUTES.EDITBLOG.replace(':id', this.state.data.id);
  //       this.props.history.push(url);
  //       break;
  //     }
  //     case 2: {
  //       let url = ROUTES.EDITEVENT.replace(':id', this.state.data.id);
  //       this.props.history.push(url);
  //       break;
  //     }
  //     case 3: {
  //       let url = ROUTES.EDITOFFER.replace(':id', this.state.data.id);
  //       this.props.history.push(url);
  //       break;
  //     }
  //   }
  // };
  openNotification = (message, description, status) => {
    let style = { color: 'green' };
    if (!status)
      style = {
        color: 'red',
      };
    const args = {
      message,
      description,
      duration: 3,
      style,
    };
    notification.open(args);
  };
  render() {
    const { navigationDeployed } = this.state;
    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? 'addelders-page sidebar-page sidebar-page--open position-relative'
              : 'addelders-page sidebar-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type='button'
              className='btn btn-trigger'
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}
          <main className='sidebar-page-wrapper position-relative'>
            <div className='internal-header'>
              <div className='internal-header-left'>
                <h2>
                  View{' '}
                  {this.state.data &&
                  this.state.data.category_type &&
                  this.state.data.category_type === 1
                    ? 'Blog'
                    : this.state.data &&
                      this.state.data.category_type &&
                      this.state.data.category_type === 2
                    ? 'Event'
                    : this.state.data &&
                      this.state.data.category_type &&
                      this.state.data.category_type === 3
                    ? 'Offer'
                    : ''}
                </h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-6'>
                  <div className='community-title'>
                    <h2>
                      {this.state.data &&
                        `${this.state.data.title && this.state.data.title}`}
                    </h2>
                  </div>
                </div>
                <div className='col-6 text-right'>
                  {/* <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => this.onEditPost()}
                  >
                    Edit Post
                  </button>{' '}
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => this.onDeletePost()}
                  >
                    Delete Post
                  </button> */}
                </div>
              </div>

              <hr />
              <div className='row'>
                <div className='col-6'>
                  <div className='community-status request-status'>
                    {this.state.data && this.state.data.statusObj.name && (
                      <div
                        className={
                          this.state.data.statusObj.name === 'Published'
                            ? 'status-green'
                            : this.state.data.statusObj.name === 'Draft'
                            ? 'status-orange'
                            : ''
                        }
                      >
                        <FontAwesomeIcon icon={faCircle} />
                        {this.state.data && `${this.state.data.statusObj.name}`}
                      </div>
                    )}
                  </div>

                  <div className='community-type'>
                    <b>Type: </b>
                    {this.state.data && `${this.state.data.category}`}
                  </div>
                  {this.state.data &&
                  (this.state.data.category_type === 2 ||
                    this.state.data.category_type === 3) ? (
                    <div>
                      <div className='community-start-date'>
                        <b>Start Date: </b> {this.state.data.start_date}
                      </div>
                      <div className='community-end-date'>
                        <b>End Date: </b> {this.state.data.end_date}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {/* <div className='community-status'>
                    <span>
                      <b>Status: </b>
                    </span>
                    {this.state.data && this.state.data.statusObj.name && (
                      <span
                        className={
                          this.state.data.statusObj.name === 'Published'
                            ? 'status-green'
                            : this.state.data.statusObj.name === 'Draft'
                            ? 'status-orange'
                            : ''
                        }
                      >
                        {this.state.data && `${this.state.data.statusObj.name}`}
                      </span>
                    )}
                  </div> */}
                  <div className='community-author'>
                    <b>Author: </b>
                    {this.state.data &&
                      `${
                        this.state.data.author ? this.state.data.author : 'N/A'
                      }`}
                  </div>
                  <div className='community-summary'>
                    <b>Summary: </b>
                    {this.state.data &&
                      `${
                        this.state.data.description
                          ? this.state.data.description
                          : 'N/A'
                      }`}
                  </div>
                  <div className='community-summary'>
                    <b>Theme: </b>
                    {this.state.data &&
                      `${
                        this.state.data.theme ? this.state.data.theme : 'N/A'
                      }`}
                  </div>
                  {this.state.data && this.state.data.category_type == 2 ? (
                    <div className='community-summary'>
                      <b>Address: </b>
                      {this.state.data &&
                        `${
                          this.state.data.address &&
                          this.state.data.address.length
                            ? this.state.data.address[0].address_line_1
                            : 'N/A'
                        }`}
                    </div>
                  ) : null}
                  <hr />
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        this.state.data &&
                        this.state.data.content &&
                        this.state.data.content
                          .replace(/&gt;/g, '>')
                          .replace(/&lt;/g, '<'),
                    }}
                  />
                </div>
                <div div className='col-6 text-right'>
                  <div className='banner-image'>
                    {this.state.data && this.state.data.media && (
                      <img src={this.state.data.media} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }
}
export default hasPermission(requireAuth(ViewCommunityPage));
