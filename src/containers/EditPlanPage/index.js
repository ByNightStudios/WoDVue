import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { notification, Select } from 'antd';
import { Button, Form } from 'react-bootstrap';
import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import requireAuth from '../../hoc/requireAuth';
import PageLoader from '../../components/PageLoader';
import ImageUpload from '../../components/ImageUpload';
import SideNavigation from '../../components/SideNavigation';

import EditPlanManagerFile from './dataManager';
import hasPermission from '../../hoc/hasPermission';

import styles from './edit-plan-page.scss';

const EditPlanManager = new EditPlanManagerFile();

class EditPlanPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      navigationDeployed: true,
      categories: [],
      image_url: '',
      formData: {
        planID: null,
        image_uuid: null,
        planCategoryID: null,
        name: '',
        description: '',
        planServices: [
          {
            name: '',
            description: '',
          },
        ],
        planPrices: [],
      },
      status: 1,
    };

    this.currencies = ['INR', 'USD', 'GBP', 'EUR'];
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Edit Plan';
    this.getPlanCategories();
    this.getPlanData(this.props.match.params.id);
  }

  getPlanCategories = () => {
    this._startPageLoader();
    EditPlanManager.getPlanCategories()
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.response.data.message, 0);
      });
  };

  getPlanData = (id) => {
    EditPlanManager.getPlanByID({ plan_id: id })
      .then((res) => {
        if (res.data.length && res.data[0].plan.length) {
          this.populatePlanData(res.data[0]);
        } else {
          this._stopPageLoader();
        }
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.response.data.message, 0);
      });
  };

  populatePlanData = (data) => {
    let formData = this.state.formData;
    let plan = data.plan.length ? data.plan[0] : null;

    let planCategoryID = _.get(data, 'id', null);
    let planID = _.get(plan, 'id');
    let name = _.get(plan, 'name', '');
    let description = _.get(plan, 'description', '');

    if (plan.plan_services.length) {
      for (let service of plan.plan_services) {
        delete service['id'];
      }
    }

    let planServices = _.get(plan, 'plan_services', [
      {
        name: '',
        description: '',
      },
    ]);

    let planPrices = formData.planPrices;
    let currencyExistCheck = true;

    if (plan.plan_prices.length) {
      for (let price of plan.plan_prices) {
        if (planPrices.length) {
          for (let currencyObject of planPrices) {
            if (currencyObject.name === price.currency) {
              currencyObject.data.push({
                currency: price.currency,
                duration: price.duration,
                price: price.price,
              });

              currencyExistCheck = true;
            } else {
              currencyExistCheck = false;
            }
          }
        } else {
          currencyExistCheck = false;
        }

        if (!currencyExistCheck) {
          planPrices.push({
            name: price.currency,
            data: [
              {
                currency: price.currency,
                price: price.price,
                duration: price.duration,
              },
            ],
          });

          currencyExistCheck = true;
        }
      }
    } else {
      planPrices.push({
        name: 'INR',
        data: [
          {
            currency: 'INR',
            price: '',
            duration: '',
          },
        ],
      });
    }

    let image_url = _.get(plan, 'media', '');
    let status = _.get(plan, 'status', 1);

    formData = {
      planCategoryID,
      name,
      description,
      planPrices,
      planServices,
      planID,
    };

    this.setState({
      formData,
      image_url,
      loader: false,
      status,
    });
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
      duration: 5,
      style,
    };
    notification.open(args);
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  _startPageLoader = () => {
    this.setState({
      loader: true,
    });
  };

  _stopPageLoader = () => {
    this.setState({
      loader: false,
    });
  };

  setStateValues = (fieldName, e) => {
    let formData = this.state.formData;

    switch (fieldName) {
      case 'planCategoryID':
        formData[fieldName] = e;
        break;
      case 'image_uuid':
        formData[fieldName] = e;
        break;

      default:
        formData[fieldName] = e.currentTarget.value;
        break;
    }

    this.setState(formData);
  };

  setPlanServicesValues = (fieldName, e, index) => {
    let planServices = this.state.formData.planServices;
    const formData = this.state.formData;
    planServices[index][fieldName] = e.currentTarget.value;
    this.setState({
      formData: {
        ...formData,
        planServices,
      },
    });
  };

  removePlanServices = (index) => {
    let planServices = this.state.formData.planServices;
    const formData = this.state.formData;

    let newPlanServices = planServices.filter((item, itemIndex) => {
      return itemIndex !== index;
    });

    this.setState({
      formData: {
        ...formData,
        planServices: newPlanServices,
      },
    });
  };

  addPlanServices = () => {
    let planServices = this.state.formData.planServices;
    const formData = this.state.formData;

    planServices.push({
      name: '',
      description: '',
    });

    this.setState({
      formData: {
        ...formData,
        planServices,
      },
    });
  };

  setPlanPricesValues = (currency, fieldName, e, itemIndex, currencyIndex) => {
    let planPrices = this.state.formData.planPrices;
    const formData = this.state.formData;
    planPrices.map((currencyObject, currencyObjectIndex) => {
      if (
        currencyObject.name === currency &&
        currencyObjectIndex === currencyIndex
      ) {
        let data = currencyObject.data;
        data[itemIndex][fieldName] = e.currentTarget.value;
        currencyObject.data = data;
        planPrices[currencyObjectIndex] = currencyObject;
        this.setState({
          formData: {
            ...formData,
            planPrices,
          },
        });
      }
    });
  };

  addPlanCurrency = () => {
    let planPrices = this.state.formData.planPrices;
    const formData = this.state.formData;

    const existingCurrencies = planPrices.map((item) => {
      return item.name;
    });

    let availableCurrencies = this.currencies.filter(
      (x) => !existingCurrencies.includes(x)
    );

    planPrices.push({
      name: availableCurrencies[0],
      data: [
        {
          currency: availableCurrencies[0],
          price: '',
          duration: '',
        },
      ],
    });

    this.setState({
      formData: {
        ...formData,
        planPrices,
      },
    });
  };

  removePlanCurrency = (index) => {
    let planPrices = this.state.formData.planPrices;
    const formData = this.state.formData;
    let newPlanPrices = planPrices.filter((item, itemIndex) => {
      return itemIndex !== index;
    });
    this.setState({
      formData: {
        ...formData,
        planPrices: newPlanPrices,
      },
    });
  };

  handleCurrencyChange = (index, value) => {
    let planPrices = this.state.formData.planPrices;
    const formData = this.state.formData;

    let newPlanPrices = planPrices.map((item, itemIndex) => {
      if (itemIndex === index) {
        item.name = value;
        item.data.forEach((row) => {
          row.currency = value;
        });

        return item;
      } else {
        return item;
      }
    });

    this.setState({
      formData: {
        ...formData,
        planPrices: newPlanPrices,
      },
    });
  };

  addPlanPrice = (currency, index) => {
    let planPrices = this.state.formData.planPrices;
    const formData = this.state.formData;
    planPrices.map((currencyObject, currencyObjectIndex) => {
      if (currencyObject.name === currency && index === currencyObjectIndex) {
        currencyObject.data.push({
          currency,
          price: '',
          duration: '',
        });

        planPrices[currencyObjectIndex] = currencyObject;
        this.setState({
          formData: {
            ...formData,
            planPrices,
          },
        });
      }
    });
  };

  removePlanPrice = (currency, currencyIndex, itemIndex) => {
    let planPrices = this.state.formData.planPrices;
    const formData = this.state.formData;
    planPrices.map((currencyObject, currencyObjectIndex) => {
      if (
        currencyObject.name === currency &&
        currencyObjectIndex === currencyIndex
      ) {
        let newData = currencyObject.data.filter((data, index) => {
          return index !== itemIndex;
        });

        currencyObject.data = newData;
        planPrices[currencyObjectIndex] = currencyObject;
        this.setState({
          formData: {
            ...formData,
            planPrices,
          },
        });
      }
    });
  };

  editPlanHandler = () => {
    const formValidity = EditPlanManager.editPlanValidator(this.state.formData);

    if (!formValidity.status) {
      return this.openNotification('Error', formValidity.message, 0);
    } else {
      this._startPageLoader();
      EditPlanManager.editPlan(this.state.formData)
        .then((res) => {
          this._stopPageLoader();
          this.openNotification('Success', 'Plan Updated Successfully.', 1);
          this.props.history.push('/plans');
        })
        .catch((error) => {
          this._stopPageLoader();
          this.openNotification('Error', error.response.data.message, 0);
        });
    }
  };

  disablePlanHandler = () => {
    EditPlanManager.deletePlan({ plan_id: this.state.formData.planID })
      .then((res) => {
        this._stopPageLoader();
        this.openNotification('Success', 'Plan Deleted Successfully.', 1);
        this.props.history.push('/plans');
      })
      .catch((error) => {
        this._stopPageLoader();
        this.openNotification('Error', error.response.data.message, 0);
      });
  };

  render() {
    const { navigationDeployed, categories, formData } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'addplan-page sidebar-page sidebar-page--open position-relative'
              : 'addplan-page sidebar-page sidebar-page--closed position-relative'
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
                <h2>Edit Plan Details</h2>
              </div>
            </div>
            <div className='internal-content'>
              <Form>
                <div className='internal-content-wrapper'>
                  <div className='addplan-page-category'>
                    <h4>Plan Category</h4>

                    <Form.Group controlId='plan_category'>
                      <Form.Label>Select Plan Category</Form.Label>

                      <Select
                        value={formData.planCategoryID}
                        placeholder='Plan Category'
                        onChange={(e) =>
                          this.setStateValues('planCategoryID', e)
                        }
                        style={{ minWidth: 300 }}
                      >
                        <Select.Option disabled value={null}>
                          Please select a plan category
                        </Select.Option>
                        {categories &&
                          categories.length &&
                          categories.map((category, index) => {
                            return (
                              <Select.Option key={index} value={category.id}>
                                {category.category}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Group>
                  </div>

                  <div className='addplan-page-metadata'>
                    <div className='metadata-header'>
                      <h4>Plan Details</h4>
                    </div>

                    <div className='metadata-content'>
                      <Form.Group controlId='plan_image'>
                        <ImageUpload
                          type='Icon'
                          file_type='5'
                          owner_type='Plan'
                          uploadTitle='Photo'
                          onImageUpload={(id) =>
                            this.setStateValues('image_uuid', id)
                          }
                          image_url={this.state.image_url}
                        />
                      </Form.Group>

                      <Form.Group controlId='name'>
                        <Form.Label>Plan Name</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Emoha Assure Plan'
                          value={formData.name}
                          onChange={(e) => this.setStateValues('name', e)}
                        />
                      </Form.Group>

                      <Form.Group controlId='description'>
                        <Form.Label>Plan Description</Form.Label>

                        <Form.Control
                          rows='4'
                          as='textarea'
                          placeholder="Short introduction about the plan and it's features..."
                          value={formData.description}
                          onChange={(e) =>
                            this.setStateValues('description', e)
                          }
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className='addplan-page-services'>
                    <h4>Plan Services</h4>

                    <div className='services-list'>
                      {formData.planServices.length &&
                        formData.planServices.map((service, index) => {
                          return (
                            <div className='services-item' key={index}>
                              <h6>Service {index + 1}</h6>

                              <div className='row align-items-start'>
                                <div className='col-12 col-sm-4'>
                                  <Form.Group controlId='name'>
                                    <Form.Label>Service Title</Form.Label>
                                    <Form.Control
                                      type='text'
                                      placeholder='Assure Service'
                                      value={formData.planServices[index].name}
                                      maxLength={20}
                                      onChange={(e) =>
                                        this.setPlanServicesValues(
                                          'name',
                                          e,
                                          index
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>

                                <div className='col-12 col-sm-6'>
                                  <Form.Group controlId='description'>
                                    <Form.Label>Service Description</Form.Label>

                                    <Form.Control
                                      rows='3'
                                      as='textarea'
                                      maxLength={100}
                                      placeholder='Short introduction about the service...'
                                      value={
                                        formData.planServices[index].description
                                      }
                                      onChange={(e) =>
                                        this.setPlanServicesValues(
                                          'description',
                                          e,
                                          index
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </div>

                                <div className='col-12 col-sm-2'>
                                  {formData.planServices.length &&
                                    formData.planServices.length > 1 && (
                                      <Button
                                        type='button'
                                        className='btn btn-link'
                                        onClick={() =>
                                          this.removePlanServices(index)
                                        }
                                      >
                                        <FontAwesomeIcon icon={faTrash} />{' '}
                                        Remove
                                      </Button>
                                    )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className='services-option text-center'>
                      <Button
                        onClick={() => this.addPlanServices()}
                        type='button'
                        className='btn btn-link'
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add More Services
                      </Button>
                    </div>
                  </div>

                  <div className='addplan-page-pricing'>
                    <h4>Plan Pricing</h4>

                    <div className='pricing-list'>
                      {formData.planPrices.length &&
                        formData.planPrices.map((currencyObject, index) => {
                          return (
                            <div className='pricing-item' key={index}>
                              <div className='pricing-item-header'>
                                <Form.Group controlId='planPricing'>
                                  <Form.Label>Choose a Currency</Form.Label>

                                  <Select
                                    value={currencyObject.name}
                                    placeholder='Plan Currency'
                                    onChange={(val) =>
                                      this.handleCurrencyChange(index, val)
                                    }
                                    style={{ minWidth: 300 }}
                                  >
                                    <Select.Option key='1' value='INR'>
                                      INR
                                    </Select.Option>
                                    <Select.Option key='2' value='USD'>
                                      USD
                                    </Select.Option>
                                    <Select.Option key='2' value='GBP'>
                                      GBP
                                    </Select.Option>
                                    <Select.Option key='2' value='EUR'>
                                      EUR
                                    </Select.Option>
                                  </Select>
                                </Form.Group>

                                {formData.planPrices.length > 1 && (
                                  <Button
                                    onClick={() =>
                                      this.removePlanCurrency(index)
                                    }
                                    type='button'
                                    className='btn btn-link'
                                  >
                                    <FontAwesomeIcon icon={faTrash} /> Remove
                                  </Button>
                                )}
                              </div>

                              {currencyObject.data.length &&
                                currencyObject.data.map(
                                  (currencyData, currencyDataIndex) => {
                                    return (
                                      <div
                                        className='pricing-item-content'
                                        key={currencyDataIndex}
                                      >
                                        <div className='row align-items-start'>
                                          <div className='col-12 col-sm-5'>
                                            <Form.Group controlId='name'>
                                              <Form.Label>Amount</Form.Label>
                                              <Form.Control
                                                type='text'
                                                placeholder='35000'
                                                onChange={(e) =>
                                                  this.setPlanPricesValues(
                                                    currencyObject.name,
                                                    'price',
                                                    e,
                                                    currencyDataIndex,
                                                    index
                                                  )
                                                }
                                                value={currencyData.price}
                                              />
                                            </Form.Group>
                                          </div>

                                          <div className='col-12 col-sm-5'>
                                            <Form.Group controlId='description'>
                                              <Form.Label>
                                                Duration{' '}
                                                <small>(In Months)</small>
                                              </Form.Label>

                                              <Form.Control
                                                type='text'
                                                placeholder='3'
                                                onChange={(e) =>
                                                  this.setPlanPricesValues(
                                                    currencyObject.name,
                                                    'duration',
                                                    e,
                                                    currencyDataIndex,
                                                    index
                                                  )
                                                }
                                                value={currencyData.duration}
                                              />
                                            </Form.Group>
                                          </div>

                                          {currencyObject.data.length > 1 && (
                                            <div className='col-12 col-sm-2'>
                                              <Button
                                                type='button'
                                                className='btn btn-link'
                                                onClick={() =>
                                                  this.removePlanPrice(
                                                    currencyObject.name,
                                                    index,
                                                    currencyDataIndex
                                                  )
                                                }
                                              >
                                                <FontAwesomeIcon
                                                  icon={faTrash}
                                                />{' '}
                                                Remove
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}

                              <div className='pricing-option text-center'>
                                <Button
                                  onClick={() =>
                                    this.addPlanPrice(
                                      currencyObject.name,
                                      index
                                    )
                                  }
                                  type='button'
                                  className='btn btn-link'
                                >
                                  <FontAwesomeIcon icon={faPlus} /> Add Another
                                  Price
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className='services-option text-center'>
                      {formData.planPrices.length < this.currencies.length && (
                        <Button
                          onClick={() => this.addPlanCurrency()}
                          type='button'
                          className='btn btn-link'
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add More Currencies
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className='addplan-page-metadata'>
                    {this.state.status ? (
                      <React.Fragment>
                        <Button
                          type='button'
                          onClick={() => this.editPlanHandler()}
                          className='btn btn-primary'
                        >
                          EDIT PLAN
                        </Button>

                        <Button
                          type='button'
                          onClick={() => this.disablePlanHandler()}
                          className='btn btn-secondary'
                        >
                          DELETE PLAN
                        </Button>
                      </React.Fragment>
                    ) : null}
                  </div>
                </div>
              </Form>
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
  requireAuth(connect(mapStateToProps, {})(EditPlanPage))
);
