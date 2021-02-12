import React from 'react';
import * as _ from 'lodash';
import { Button, Form } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import styles from './add-community-theme-page.scss';
import { notification } from 'antd';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';
import ImageUpload from '../../components/ImageUpload';
import CommunityThemeManagerFile from './dataManager';

class AddCommunityThemePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationDeployed: true,
      loader: false,
      image_url: null,
      status: 1,
      theme: '',
      image_uuid: null
    };

    this.communityThemeManager = new CommunityThemeManagerFile();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add a Community Theme';
  }
  uploadedImageData = image_uuid => {
    this.setState({ image_uuid });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  _startLoader = () => {
    this.setState({ loader: true });
  };

  _stopLoader = () => {
    this.setState({ loader: false });
  };

  setStateValues = (e, field) => {
    let value = e.currentTarget.value;
    let state = this.state;
    state[`${field}`] = value;
    this.setState(state);
  };

  openNotification = (message, description, status) => {
    let style = { color: 'green' };
    if (!status)
      style = {
        color: 'red'
      };
    const args = {
      message,
      description,
      duration: 3,
      style
    };
    notification.open(args);
  };

  addCommunityThemeHandler = () => {
    if (!this.state.theme) {
      return this.openNotification(
        'Error',
        'Please provide a name for the theme.',
        0
      );
    }

    this._startLoader();
    this.communityThemeManager
      .addCommunityTheme(this.state)
      .then(result => {
        this.openNotification(
          'Success',
          'Community Theme Added Successfully.',
          1
        );
        this._stopLoader();
        this.props.history.push('/community/themes');
      })
      .catch(error => {
        let err = _.get(error, 'response.data');
        if (err) {
          this.openNotification('Error', err.message, 0);
        } else this.openNotification('Error', 'Please try again later', 0);

        this._stopLoader();
      });
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
                <h2>Add a Community Theme</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12'>
                  <div className='form-container'>
                    <Form className='map-provider-form'>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='responderFirstName'>
                            <Form.Label>Thumbnail Picture</Form.Label>
                            <ImageUpload
                              uploadTitle='Photo'
                              image_url={this.state.image_url}
                              onImageUpload={this.uploadedImageData}
                              notification={this.openNotification}
                              type='Icon'
                              owner_type='CommunityFeedTheme'
                              file_type='6'
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12 col-sm-6'>
                          <Form.Group controlId='title'>
                            <Form.Label>Theme Name</Form.Label>
                            <Form.Control
                              type='text'
                              maxLength='100'
                              placeholder='Theme Name'
                              onChange={e => this.setStateValues(e, 'theme')}
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <Button
                        onClick={this.addCommunityThemeHandler}
                        className='btn btn-primary'
                      >
                        Add
                      </Button>
                    </Form>
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

const mapStateToProps = state => ({
  user: state.user.user
});

export default requireAuth(connect(mapStateToProps, {})(AddCommunityThemePage));
