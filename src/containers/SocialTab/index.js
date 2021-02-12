/**
 *
 * SocialTab
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSocialTab from './selectors';
import reducer from './reducer';
import saga from './saga';

import {
  getSocialDataStart,
  postElderPersonaStart,
  postEduQualStart,
  postEmploymentStart,
  postLocationStart,
  postPreferencesStart
} from './actions';

import ElderPersona from '../../components/SocialTabComponents/ElderPersona';
import EducationalQualification from '../../components/SocialTabComponents/EducationalQualification';
import EmploymentOrganisations from '../../components/SocialTabComponents/EmploymentOrganisations';

import LocationInfo from '../../components/SocialTabComponents/LocationInfo';
import Preferences from '../../components/SocialTabComponents/Preferences';

import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
export function SocialTab(props) {
  useInjectReducer({ key: 'socialTab', reducer });
  useInjectSaga({ key: 'socialTab', saga });

  const isNotErmOrErmSupervisor = checkIsErmOrErmSuperVisor(props.user, props.elderData);

  function manipulatePayload(values) {
    const payload = {
      user_uuid: props.currentElderIdentifier,
      ...values,
    };
    return payload;
  }

  const {
    socialTabData,
    getSocialData,
    postElderPersona,
    handleLocationFormValues,
    handleEducationFormValuesOnSubmit,
    handleEmploymentFormValues,
    handlePreferencesFormValues
  } = props;

  function manipulatePayload(values) {
    const manipulatedPayload = {
      user_uuid: props.currentElderIdentifier,
      ...values,
    };
    return manipulatedPayload;
  };

  useEffect(() => {
    getSocialData(props.currentElderIdentifier);
  }, []);

  return (
    <>
      <Collapse
        bordered
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={['1', '2', '3', '4', '5']}
      >
        <Collapse.Panel
          header='Elder Persona'
          key="1"
          className="site-collapse-custom-panel"
        >
          <ElderPersona
            isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
            elderPersona={get(socialTabData, 'data.elderPersona', null)}
            isLoading={get(socialTabData, 'isLoading', false)}
            isElderPersonaUpdating={get(socialTabData, 'isElderPersonaUpdating', false)}
            postElderPersona={values => postElderPersona(manipulatePayload(values))}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header='Educational Qualification'
          key="2"
          className="site-collapse-custom-panel"
        >
          <EducationalQualification
            isLoading={get(socialTabData, 'isLoading', false)}
            isEduQualUpdating={get(socialTabData, 'isEduQualUpdating', false)}
            educationQualifications={get(socialTabData, 'data.elderEducationalQualification', [])}
            isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
            educationFormSubmit={(values, setModalVisibility) => handleEducationFormValuesOnSubmit(manipulatePayload(values), setModalVisibility)}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header='Employment Organisations'
          key="3"
          className="site-collapse-custom-panel"
        >
          <EmploymentOrganisations
            isLoading={get(socialTabData, 'isLoading', false)}
            isEmploymentUpdating={get(socialTabData, 'isEmploymentUpdating', false)}
            employments={get(socialTabData, 'data.consumerEmploymentOrganisation', [])}
            isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
            employmentFormSubmit={(values, setModalVisibility) => handleEmploymentFormValues(manipulatePayload(values), setModalVisibility)}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header='Location Information'
          key="4"
          className="site-collapse-custom-panel"
        >
          <LocationInfo
            isLoading={get(socialTabData, 'isLoading', false)}
            isLocationUpdating={get(socialTabData, 'isLocationUpdating', false)}
            location={get(socialTabData, 'data.consumerLocationInformation', null)}
            isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
            locationFormSubmit={values => handleLocationFormValues(manipulatePayload(values))}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header='Preferences'
          key="5"
          className="site-collapse-custom-panel"
        >
          <Preferences
            isLoading={get(socialTabData, 'isLoading', false)}
            isPreferencesUpdating={get(socialTabData, 'isPreferencesUpdating', false)}
            preferences={get(socialTabData, 'data.consumerPreference', null)}
            isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
            preferencesFormSubmit={values => handlePreferencesFormValues(manipulatePayload(values))}
          />
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

SocialTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
  getSocialData: PropTypes.func,
  postElderPersona: PropTypes.func,
  handleEducationFormValuesOnSubmit: PropTypes.func,
  handleEmploymentFormValues: PropTypes.func,
  handleLocationFormValues: PropTypes.func,
  handlePreferencesFormValues: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  socialTabData: makeSelectSocialTab(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getSocialData: id => dispatch(getSocialDataStart(id)),
    postElderPersona: payload => dispatch(postElderPersonaStart(payload)),
    handleEducationFormValuesOnSubmit: (values, setModalVisibility) => dispatch(postEduQualStart({
      values,
      setModalVisibility
    })),
    handleEmploymentFormValues: (values, setModalVisibility) => dispatch(postEmploymentStart({
      values,
      setModalVisibility
    })),
    handleLocationFormValues: values => dispatch(postLocationStart(values)),
    handlePreferencesFormValues: values => dispatch(postPreferencesStart(values))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
)(SocialTab);
