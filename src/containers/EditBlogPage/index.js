import React from 'react';
import { Button, Form } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';
import styles from './edit-blog-page.scss';
import { notification } from 'antd';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';
import ImageUpload from '../../components/ImageUpload';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommunityThemeService from '../../service/CommunityThemeService';

import { updateBlog, getCommunityPost } from './dataManager';
import MyCustomUploadAdapterPlugin from '../../common/CKEditorUploadAdapter';

import {
  dispatchAddBlog,
  dispatchCommunityFailure,
} from '../../actions/CommunityAction';
import hasPermission from '../../hoc/hasPermission';

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
      editMode: false,
      editorInstance: null,
      theme_id: '',
      themes: [],
    };

    this.communityThemeService = new CommunityThemeService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Edit Blog';
    this.setState({ loader: true });
    this.getThemes();
    getCommunityPost(this.props.match.params.id)
      .then((result) => {
        let data = result.data[0];
        this.setState({
          loader: false,
          editMode: true,
          community_feed_id: data.id,
          title: data.title,
          author: data.author,
          content: data.content,
          description: data.description,
          status: data.status,
          image_url: data.media,
          theme_id: data.theme_id,
        });
        this.state.editorInstance.setData(this.state.content);
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  }

  uploadedImageData = (image_uuid) => {
    this.setState({ image_uuid });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
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

  updateBlogHandler = (e) => {
    const valid = this.formValidation();

    if (!valid) {
      this.setState({ loader: false });
      return this.openNotification('Error', 'All fields are required', 0);
    }
    updateBlog(this.state)
      .then((result) => {
        this.openNotification('Success', 'Blog Update Successfully.', 1);
        this.props.dispatchAddBlog(result.data);
        this.props.history.push('/community');
      })
      .catch((error) => {
        this.openNotification('Error', error.message, 0);
        this.props.dispatchCommunityFailure(error);
      });
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
                <h2>Edit Blog</h2>
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
                              value={
                                this.state.editMode && this.state.title
                                  ? this.state.title
                                  : null
                              }
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
                              value={
                                this.state.editMode && this.state.author
                                  ? this.state.author
                                  : null
                              }
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
                              value={
                                this.state.editMode && this.state.description
                                  ? this.state.description
                                  : null
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
                              value={
                                this.state.editMode && this.state.content
                                  ? this.state.content
                                  : null
                              }
                              content={this.state.content}
                              onInit={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                                this.setState({ editorInstance: editor });
                                ClassicEditor.builtinPlugins.map((plugin) =>
                                  console.log(plugin.pluginName)
                                );
                              }}
                              config={{
                                extraPlugins: [MyCustomUploadAdapterPlugin],
                                // plugins: [Underline],
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
                                  'underline',
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
                                console.log({ event, editor, data });
                              }}
                              onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                              }}
                              onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                              }}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div>
                        <Button
                          className='btn btn-primary'
                          onClick={(e) => this.updateBlogHandler(e)}
                        >
                          Update Blog
                        </Button>{' '}
                        {(this.state.status === 1 ||
                          this.state.status === 3) && (
                          <Button
                            className='btn btn-primary'
                            onClick={(e) =>
                              this.setState({ status: 2 }, () =>
                                this.updateBlogHandler(e)
                              )
                            }
                          >
                            Update & Publish Blog
                          </Button>
                        )}{' '}
                        {this.state.status === 2 && (
                          <Button
                            className='btn btn-primary'
                            onClick={(e) =>
                              this.setState({ status: 3 }, () =>
                                this.updateBlogHandler(e)
                              )
                            }
                          >
                            Unpublish Blog
                          </Button>
                        )}
                      </div>
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
