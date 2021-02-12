import React from 'react';
import { Button, Form } from 'react-bootstrap';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { getRenderingHeader } from '../../common/helpers';

import styles from './edit-offer-page.scss';
import moment from 'moment';
import { notification, Select, Input, DatePicker } from 'antd';
import { connect } from 'react-redux';
import requireAuth from '../../hoc/requireAuth';
import ImageUpload from '../../components/ImageUpload';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyCustomUploadAdapterPlugin from '../../common/CKEditorUploadAdapter';
import CommunityThemeService from '../../service/CommunityThemeService';

import {
  dispatchAddOffer,
  dispatchCommunityFailure,
} from '../../actions/CommunityAction';
import {
  updateOffer,
  getCommunityPost,
  getCountries,
  getCities,
  getStates,
} from './dataManager';
import hasPermission from '../../hoc/hasPermission';
const { Option } = Select;

class AddEventPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      loader: false,
      image_url: null,
      image_uuid: null,
      startDate: null,
      endDate: null,
      author: null,
      status: 1,
      location: [],
      locationCount: 0,
      title: null,
      community_feed_id: null,
      content: null,
      description: null,
      editMode: null,
      countries: null,
      states: null,
      cities: null,
      editorInstance: null,
      world: [],
      themes: [],
      theme_id: '',
    };

    this.communityThemeService = new CommunityThemeService();
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Edit Offer';
    this.setState({ loader: true });
    getCommunityPost(this.props.match.params.id)
      .then((result) => {
        let data = result.data[0];
        this.setState(
          {
            community_feed_id: data.id,
            loader: false,
            editMode: true,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            content: data.content,
            description: data.description,
            author: data.author,
            image_url: data.media,
            status: data.status,
            location: data.location ? data.location : [],
            theme_id: data.theme_id,
          },
          () => {
            this.fetchWorldData();
            this.getThemes();
          }
        );
        this.state.editorInstance.setData(this.state.content);
      })
      .catch((error) => {
        this.setState({ loader: false, editMode: true });
      });

    this.getCountriesList();
  }

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

  getCountriesList = () => {
    this.setState({ loader: true });
    getCountries()
      .then((result) => {
        this.setState({ loader: false, countries: result.data });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  getStatesList = (country, index) => {
    this.setState({ loader: true });
    getStates(country)
      .then((result) => {
        let { world } = this.state;
        world[index].states = result.data;
        this.setState({ loader: false, world });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
      });
  };

  getCitiesList = (states, index) => {
    this.setState({ loader: true });
    getCities(states)
      .then((result) => {
        let { world } = this.state;
        world[index].cities = result.data;
        this.setState({ loader: false, world });
      })
      .catch((error) => {
        this.setState({ loader: false });
      });
  };

  fetchWorldData = () => {
    let { location } = this.state;

    for (let i = 0; i < location.length; i++) {
      let { world } = this.state;
      world.push({ states: null, cities: null });
      this.setState({ world }, () => {
        if (location[i].country && location[i].state) {
          this.getStatesList(location[i].country, i);
          this.getCitiesList(location[i].state, i);
        } else if (location[i].country && !location[i].state) {
          this.getStatesList(location[i].country, i);
          this.getCitiesList(location[i].state, i);
        }
      });
    }
  };

  uploadedImageData = (image_uuid) => {
    this.setState({ image_uuid });
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  };
  setStateValues = (e, field) => {
    let value;
    if (field === 'startDate' || field === 'endDate') {
      if (field === 'startDate') this.setState({ startDateObj: e });

      value = e ? moment(e._d).format('YYYY-MM-DD HH:mm') : null;
    } else value = e.currentTarget.value;
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
      startDate,
      endDate,
      theme_id,
    } = this.state;

    if (
      !author ||
      !title ||
      !description ||
      !community_feed_id ||
      !content ||
      !startDate ||
      !endDate ||
      !theme_id
    ) {
      return false;
    }
    return true;
  };

  updateOfferHandler = () => {
    const valid = this.formValidation();

    if (!valid) {
      this.setState({ loader: false });
      return this.openNotification(
        'Error',
        'All fields except target locations are required',
        0
      );
    }

    updateOffer(this.state)
      .then((result) => {
        this.openNotification('Success', 'Offer Updated Successfully.', 1);
        this.props.dispatchAddOffer(result.data);
        this.props.history.push('/community');
      })
      .catch((error) => {
        this.openNotification('Error', error.message, 0);
        this.props.dispatchCommunityFailure(error);
      });
  };
  addAnotherLocationHandler = async () => {
    await this.setState({
      locationCount: this.state.locationCount + 1,
      location: [
        ...this.state.location,
        { country: null, state: null, cities: [] },
      ],
      world: [...this.state.world, { states: null, cities: null }],
    });
  };
  removeLocationHandler = (index) => {
    let location = this.state.location.slice();
    let world = this.state.world.slice();
    let temp = [];
    let tempWorld = [];
    let i = 0;
    let j = 0;
    for (i; i <= location.length - 1; i++) {
      if (i === index) {
      } else {
        temp.push(location[i]);
      }
    }
    location = temp;

    for (j; j <= world.length - 1; j++) {
      if (j === index) {
      } else {
        tempWorld.push(world[j]);
      }
    }
    world = tempWorld;
    this.setState({
      locationCount: this.state.locationCount - 1,
      location,
      world,
    });
  };
  setLocationStateValues = (e, field, index) => {
    let value;
    let { location } = this.state;
    if (field === 'country') {
      value = e;
      location[index]['country'] = value;
      location[index]['state'] = null;
      location[index]['cities'] = [];
      this.setState({ location, disabledState: false, loader: true });
      this.getStatesList(value, index);
    } else if (field === 'cities') {
      value = e;
      location[index]['cities'] = value;
      this.setState({ location });
    } else if (field === 'state') {
      value = e;
      location[index]['state'] = value;
      location[index]['cities'] = [];
      this.setState({ location, disabledCity: false, loader: true });
      this.getCitiesList(value, index);
    }
  };
  render() {
    const { navigationDeployed, location } = this.state;
    let locations = [];
    this.state.location.map((addr, index) => {
      return locations.push(
        <div className='row'>
          <div className='col-12 col-sm-12 col-xl-12'>
            <Form.Group controlId='communityEventCountry'>
              <Form.Label>
                <div className='row'>
                  <div className='col-12'>Locations {index + 1}</div>
                </div>
              </Form.Label>
              <div className='col-sm-10'>
                <Select
                  showSearch
                  placeholder='select country'
                  onChange={(e) =>
                    this.setLocationStateValues(e, 'country', index)
                  }
                  value={
                    this.state.location[index].country
                      ? this.state.location[index].country
                      : 'VOID'
                  }
                  style={{ minWidth: 300 }}
                >
                  <Option value='VOID'>Please select a country</Option>
                  {this.state.countries
                    ? this.state.countries.map((country, index) => (
                        <Option key={index} value={country.country}>
                          {country.country}
                        </Option>
                      ))
                    : null}
                </Select>
              </div>
            </Form.Group>
            <Form.Group controlId='communityEventState'>
              <div className='col-sm-10'>
                <Select
                  showSearch
                  placeholder='select state'
                  onChange={(e) =>
                    this.setLocationStateValues(e, 'state', index)
                  }
                  disabled={this.state.location[index].country ? false : true}
                  value={
                    this.state.location[index].state
                      ? this.state.location[index].state
                      : 'VOID'
                  }
                  style={{ minWidth: 300 }}
                >
                  <Option value='VOID'>Please select a state</Option>
                  {this.state.world.length &&
                  this.state.location[index].country &&
                  this.state.world[index] &&
                  this.state.world[index].states &&
                  this.state.world[index].states.length
                    ? this.state.world[index].states.map((state, index) => (
                        <Option key={index} value={state.state}>
                          {state.state}
                        </Option>
                      ))
                    : null}
                </Select>
              </div>
            </Form.Group>
            <Form.Group controlId='communityEventCity'>
              <div className='col-sm-10'>
                <Select
                  showSearch
                  mode='multiple'
                  placeholder='select city'
                  onChange={(e) =>
                    this.setLocationStateValues(e, 'cities', index)
                  }
                  disabled={this.state.location[index].state ? false : true}
                  value={
                    this.state.location[index].cities.length
                      ? this.state.location[index].cities
                      : undefined
                  }
                  style={{ minWidth: 300 }}
                >
                  <Option value={undefined} disabled>
                    Please select a city
                  </Option>
                  {this.state.world.length &&
                  this.state.location[index].state &&
                  this.state.world[index] &&
                  this.state.world[index].cities &&
                  this.state.world[index].cities.length
                    ? this.state.world[index].cities.map((city, index) => (
                        <Option key={index} value={city.city}>
                          {city.city}
                        </Option>
                      ))
                    : null}
                </Select>
              </div>
            </Form.Group>

            <Button
              type='button'
              className='btn btn-link'
              onClick={() => this.removeLocationHandler(index)}
            >
              <FontAwesomeIcon icon={faMinus} /> Remove location
            </Button>
          </div>
        </div>
      );
    });

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
                <h2>Edit Offer</h2>
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
                              placeholder='Title'
                              maxLength='100'
                              onChange={(e) => this.setStateValues(e, 'title')}
                              value={
                                this.state.title ? this.state.title : undefined
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
                                this.state.description
                                  ? this.state.description
                                  : undefined
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='startDate'>
                            <Form.Label>Start Date</Form.Label>
                            <DatePicker
                              showTime={{ format: 'HH:mm' }}
                              showToday={false}
                              format={'YYYY-MM-DD HH:mm'}
                              onChange={(e) =>
                                this.setStateValues(e, 'startDate')
                              }
                              disabledDate={(d) =>
                                !d || d.isBefore(moment().subtract(1, 'days'))
                              }
                              value={
                                this.state.startDate != null
                                  ? moment(
                                      this.state.startDate,
                                      'YYYY-MM-DD HH:mm A'
                                    )
                                  : null
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className=' col-12 '>
                          <Form.Group controlId='endDate'>
                            <Form.Label>End Date</Form.Label>
                            <DatePicker
                              showTime={{ format: 'HH:mm' }}
                              showToday={false}
                              format={'YYYY-MM-DD HH:mm'}
                              onChange={(e) =>
                                this.setStateValues(e, 'endDate')
                              }
                              disabledDate={(d) =>
                                !d ||
                                d.isBefore(
                                  this.state.startDate
                                    ? this.state.startDate
                                    : moment().subtract(1, 'days')
                                )
                              }
                              value={
                                this.state.endDate != null
                                  ? moment(
                                      this.state.endDate,
                                      'YYYY-MM-DD HH:mm'
                                    )
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
                                this.state.author
                                  ? this.state.author
                                  : undefined
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='location'>
                            {locations}
                            <div className='row'>
                              <div className='col-12'>
                                {!this.state.locationCount ? (
                                  <Button
                                    type='button'
                                    className='btn btn-link'
                                    onClick={this.addAnotherLocationHandler}
                                  >
                                    <FontAwesomeIcon icon={faPlus} /> Add
                                    location
                                  </Button>
                                ) : (
                                  <Button
                                    type='button'
                                    className='btn btn-link'
                                    onClick={this.addAnotherLocationHandler}
                                  >
                                    <FontAwesomeIcon icon={faPlus} /> Add
                                    another location
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Form.Group controlId='content'>
                            <Form.Label>Content</Form.Label>
                            <CKEditor
                              editor={ClassicEditor}
                              style={{ height: 400 }}
                              onInit={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                this.state.content &&
                                  editor.setData(this.state.content);
                                this.setState({
                                  editorInstance: editor,
                                });
                                console.log('Editor is ready to use!', editor);
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
                                // document.querySelectorAll('oembed[url]').forEach(element => {
                                //     // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
                                //     // to discover the media.
                                //     const anchor = document.createElement('a');

                                //     anchor.setAttribute('href', element.getAttribute('url'));
                                //     anchor.className = 'embedly-card';

                                //     element.appendChild(anchor);
                                // });
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
                      <Button
                        className='btn btn-primary'
                        onClick={(e) => this.updateOfferHandler(e)}
                      >
                        Update Offer
                      </Button>{' '}
                      {(this.state.status === 1 || this.state.status === 3) && (
                        <Button
                          className='btn btn-primary'
                          onClick={(e) =>
                            this.setState({ status: 2 }, () =>
                              this.updateOfferHandler(e)
                            )
                          }
                        >
                          Update & Publish Offer
                        </Button>
                      )}{' '}
                      {this.state.status === 2 && (
                        <Button
                          className='btn btn-primary'
                          onClick={(e) =>
                            this.setState({ status: 3 }, () =>
                              this.updateOfferHandler(e)
                            )
                          }
                        >
                          Unpublish Offer
                        </Button>
                      )}
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
});

export default hasPermission(
  requireAuth(
    connect(mapStateToProps, {
      dispatchAddOffer,
      dispatchCommunityFailure,
    })(AddEventPage)
  )
);
