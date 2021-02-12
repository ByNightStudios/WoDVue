import React from 'react';

import PageLoader from '../../components/PageLoader';

import { connect } from 'react-redux';
import { getUserMedicalData } from '../../actions/UserActions';
import { Form } from 'react-bootstrap';

import styles from './user-medical-record.scss';
import { get } from 'lodash';

class UserMedicalRecordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      record: {},
    };
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Elder Medical Record';

    this.props
      .getUserMedicalData(this.props.match.params.id)
      .then((res) => {
        console.log(res);
        this.setState({ loader: false, record: res.data });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });
      });
  }

  render() {
    const { record } = this.state;
    return (
      <React.Fragment>
        <div
          className='medicalrecord-page sidebar-page sidebar-page--closed position-relative'
          style={styles}
        >
          <main className='sidebar-page-wrapper position-relative'>
            <div className='internal-header'>
              <div className='internal-header-left'>
                <h2>Elder Medical Record Details :-</h2>
              </div>
            </div>
            <div className='internal-content'>
              <div className='row'>
                <div className='col-12 col-sm-6'>
                  <div className='form-container'>
                    {this.state.record ? (
                      <div className='row'>
                        <div className='col-12'>
                          <div className='emergency-metadata d-flex align-items-center justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Preferred Hospital Name:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.hospitalName
                                ? record.hospitalName
                                : 'N/A'}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex align-items-center justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Preferred Hospital Address:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.hospitalAddress
                                ? record.hospitalAddress
                                : 'N/A'}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex align-items-center justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Blood Group:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.bloodGroup ? record.bloodGroup : 'N/A'}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex align-items-center justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Food Allergy:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.foodAllergy ? record.foodAllergy : 'N/A'}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex align-items-center justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Drug Allergy:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.drugAllergy ? record.drugAllergy : 'N/A'}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex align-items-center justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Other Allergy:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.otherAllergy
                                ? record.otherAllergy
                                : 'N/A'}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Differently Abled:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.differentlyAbled &&
                              record.differentlyAbled.length !== 0 ? (
                                <ul>
                                  {record.differentlyAbled.map(
                                    (condition, index) => {
                                      return <li key={index}>{condition}</li>;
                                    }
                                  )}
                                </ul>
                              ) : (
                                'N/A'
                              )}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Medical Conditions:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.medicalConditions &&
                              record.medicalConditions.length !== 0 ? (
                                <ul>
                                  {record.medicalConditions.map(
                                    (condition, index) => {
                                      return <li key={index}>{condition}</li>;
                                    }
                                  )}
                                </ul>
                              ) : (
                                'N/A'
                              )}
                            </span>
                          </div>

                          <div className='emergency-metadata d-flex justify-content-start'>
                            <span className='emergency-metadata-param'>
                              Mobility Conditions:
                            </span>
                            <span className='emergency-metadata-value'>
                              {record.mobilityConditions &&
                              record.mobilityConditions.length !== 0 ? (
                                <ul>
                                  {record.mobilityConditions.map(
                                    (condition, index) => {
                                      return <li key={index}>{condition}</li>;
                                    }
                                  )}
                                </ul>
                              ) : (
                                'N/A'
                              )}
                            </span>
                          </div>

                          <div className='emergency-metadata'>
                            <span className='emergency-metadata-param'>
                              Medications:
                            </span>

                            <div className='elder-medical-replicable'>
                              {record.medicationList &&
                              record.medicationList.length !== 0
                                ? record.medicationList.map(
                                    (singleMedication, index) => {
                                      return (
                                        <div
                                          className='replication-pod d-flex flex-column'
                                          key={index}
                                        >
                                          <div className='replication-pod-item'>
                                            <Form.Group>
                                              <Form.Label>Name</Form.Label>
                                              <Form.Control
                                                readOnly
                                                type='text'
                                                placeholder='Medication Name'
                                                value={get(
                                                  singleMedication,
                                                  'name',
                                                  'N/A'
                                                )}
                                              />
                                            </Form.Group>
                                          </div>
                                          <div className='replication-pod-item'>
                                            <Form.Label>Route</Form.Label>
                                            <Form.Control
                                              readOnly
                                              type='text'
                                              value={get(
                                                singleMedication,
                                                'route',
                                                'N/A'
                                              )}
                                            />
                                          </div>
                                          <div className='replication-pod-item'>
                                            <Form.Group>
                                              <Form.Label>Action</Form.Label>

                                              <Form.Control
                                                readOnly
                                                type='text'
                                                placeholder='Action'
                                                value={get(
                                                  singleMedication,
                                                  'action',
                                                  'N/A'
                                                )}
                                              />
                                            </Form.Group>
                                          </div>
                                          <div className='replication-pod-item'>
                                            <Form.Group>
                                              <Form.Label>Dose</Form.Label>
                                              <Form.Control
                                                readOnly
                                                type='text'
                                                placeholder='Dose'
                                                value={get(
                                                  singleMedication,
                                                  'dose',
                                                  'N/A'
                                                )}
                                              />
                                            </Form.Group>
                                          </div>
                                          <div className='replication-pod-item'>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control
                                              readOnly
                                              type='text'
                                              placeholder='Start Date'
                                              value={get(
                                                singleMedication,
                                                'startDate',
                                                'N/A'
                                              )}
                                            />
                                          </div>
                                          <div className='replication-pod-item'>
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control
                                              readOnly
                                              type='text'
                                              placeholder='Start Date'
                                              value={get(
                                                singleMedication,
                                                'endDate',
                                                'N/A'
                                              )}
                                            />
                                          </div>
                                          <div className='replication-pod-item'>
                                            <Form.Label>Frequency</Form.Label>
                                            <Form.Control
                                              readOnly
                                              type='text'
                                              placeholder='Frequency'
                                              value={get(
                                                singleMedication,
                                                'frequency',
                                                'N/A'
                                              )}
                                            />
                                          </div>
                                        </div>
                                      );
                                    }
                                  )
                                : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      'No record found!'
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

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getUserMedicalData })(
  UserMedicalRecordPage
);
