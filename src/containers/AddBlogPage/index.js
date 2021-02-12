import React from 'react';
import moment from 'moment';

import {
  dispatchAddBlog,
  dispatchCommunityFailure,
} from '../../actions/CommunityAction';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import { addBlog, createFeed } from './dataManager';

import requireAuth from '../../hoc/requireAuth';
import ImageUpload from '../../components/ImageUpload';
import CKEditor from '@ckeditor/ckeditor5-react';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommunityThemeService from '../../service/CommunityThemeService';
import MyCustomUploadAdapterPlugin from '../../common/CKEditorUploadAdapter';
import hasPermission from '../../hoc/hasPermission';

import styles from './add-blog-page.scss';

class AddBlogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationDeployed: true,
      loader: false,
      image_url: null,
      status: 1,
      title: '',
      author: '',
      community_feed_id: null,
      content: '',
      description: '',
      image_uuid: null,
      themes: [],
      theme_id: '',
    };

    this.communityThemeService = new CommunityThemeService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Add a Blog';

    this.getThemes();
  }
  uploadedImageData = (image_uuid) => {
    this.setState({ image_uuid });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  getThemes = () => {
    this.setState({ loader: true });
    this.communityThemeService
      .getCommunityTheme({ page: 'all' })
      .then((result) => {
        if (result.data && result.data.length) {
          this.setState({ themes: result.data, loader: false });
        } else {
          this.setState({ themes: [], loader: false });
        }
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
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

  addBlogHandler = (e) => {
    this.setState({ loader: true }, () => {
      if (!this.state.community_feed_id) {
        createFeed()
          .then((res) => {
            this.setState({ community_feed_id: res }, () => {
              this.addCommunityBlog();
            });
          })
          .catch((err) => {
            this.openNotification('Error', err.message, 0);
            this.setState({ loader: false });
          });
      } else {
        this.addCommunityBlog();
      }
    });
  };

  formValidation = () => {
    const {
      author,
      title,
      description,
      content,
      community_feed_id,
      theme_id,
    } = this.state;

    if (
      !author ||
      !title ||
      !description ||
      !community_feed_id ||
      !theme_id ||
      !content
    ) {
      return false;
    }
    return true;
  };

  addCommunityBlog = () => {
    const valid = this.formValidation();

    if (!valid) {
      this.setState({ loader: false });
      return this.openNotification('Error', 'All fields are required', 0);
    }
    addBlog(this.state)
      .then((result) => {
        this.openNotification('Success', 'Blog Add Successfully.', 1);
        this.setState({ loader: false });
        this.props.dispatchAddBlog(result.data);
        this.props.history.push('/community');
      })
      .catch((error) => {
        this.openNotification('Error', error.message, 0);
        this.setState({ loader: false });
        this.props.dispatchCommunityFailure(error);
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
                <h2>Add a Blog</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-8'>
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
                              owner_type='CommunityFeed'
                              file_type='4'
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='title'>
                            <Form.Label>Theme</Form.Label>
                            <Form.Control
                              as='select'
                              onChange={(e) =>
                                this.setStateValues(e, 'theme_id')
                              }
                              value={this.state.theme_id}
                            >
                              <option disabled value={''}>
                                Please select a theme
                              </option>
                              {this.state.themes.length
                                ? this.state.themes.map((theme, index) => {
                                    return (
                                      <option value={theme.id}>
                                        {theme.theme}
                                      </option>
                                    );
                                  })
                                : null}
                            </Form.Control>
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type='text'
                              maxLength='100'
                              placeholder='Title'
                              onChange={(e) => this.setStateValues(e, 'title')}
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='author'>
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                              type='text'
                              maxLength='100'
                              placeholder='Author'
                              onChange={(e) => this.setStateValues(e, 'author')}
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='description'>
                            <Form.Label>Summary</Form.Label>
                            <Form.Control
                              type='text'
                              maxLength='100'
                              placeholder='Summary'
                              onChange={(e) =>
                                this.setStateValues(e, 'description')
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='body'>
                            <Form.Label>Content</Form.Label>
                            <CKEditor
                              editor={ClassicEditor}
                              style={{ height: 400 }}
                              onInit={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                // console.log('Editor is ready to use!', editor);
                              }}
                              config={{
                                extraPlugins: [MyCustomUploadAdapterPlugin],
                                removePlugins: [
                                  'Table',
                                  'MediaEmbed',
                                  'BlockQuote',
                                ],
                                toolbar: [
                                  'heading',
                                  '|',
                                  'bold',
                                  'italic',
                                  'link',
                                  'numberedList',
                                  'bulletedList',
                                  'imageUpload',
                                  'insertTable',
                                  'tableColumn',
                                  'tableRow',
                                  'mergeTableCells',
                                  'mediaEmbed',
                                  '|',
                                  'undo',
                                  'redo',
                                ],
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                this.setState({
                                  content: data,
                                });
                                // console.log({ event, editor, data });
                              }}
                              onBlur={(event, editor) => {
                                // console.log('Blur.', editor);
                              }}
                              onFocus={(event, editor) => {
                                // console.log('Focus.', editor);
                              }}
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <Button
                        className='btn btn-primary'
                        onClick={(e) =>
                          this.setState({ status: 1 }, () =>
                            this.addBlogHandler(e)
                          )
                        }
                      >
                        Save Blog As Draft
                      </Button>{' '}
                      <Button
                        className='btn btn-primary'
                        onClick={(e) =>
                          this.setState({ status: 2 }, () =>
                            this.addBlogHandler(e)
                          )
                        }
                      >
                        Publish Blog
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

const mapStateToProps = (state) => ({
  user: state.user.user,
  community: state.community,
});

export default hasPermission(
  requireAuth(
    connect(mapStateToProps, {
      dispatchAddBlog,
      dispatchCommunityFailure,
    })(AddBlogPage)
  )
);
