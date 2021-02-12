/**
 *
 * ElderPersona
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { DatePicker, Row, Select, Form, Button, Space, Skeleton } from "antd";
import PropTypes from "prop-types";
import { get, isNil } from 'lodash'
import moment from 'moment';

import ResponsiveGrid from '../../ResponsiveGrid';
import { ageCalculation } from '../../../utils/other';

const tailLayout = {
  wrapperCol: {
    span: 24
  },
};

const handleOnFinish = (
  values,
  postElderPersona
) => {
  let updatedAnniversaryDate = get(values, 'anniversary_date');

  if (updatedAnniversaryDate && updatedAnniversaryDate !== '') {
    updatedAnniversaryDate = moment(updatedAnniversaryDate).format('YYYY-MM-DD');
  }

  delete values.age_cohort;

  postElderPersona({
    ...values,
    anniversary_date: updatedAnniversaryDate
  });
};

const onChange = (value, setIsWithRelativeShown) => {
  if (value === 'with children') setIsWithRelativeShown(true);
  else setIsWithRelativeShown(false);
};
function ElderPersona(props) {
  const [form] = Form.useForm();
  const [isWithRelativeShown, setIsWithRelativeShown] = useState(false);

  const {
    isNotErmOrErmSupervisor,
    elderPersona,
    postElderPersona,
    isLoading,
    isElderPersonaUpdating
  } = props;

  let updatedAnniversaryDate = get(elderPersona, 'anniversary_date');

  if (updatedAnniversaryDate && updatedAnniversaryDate !== '') {
    updatedAnniversaryDate = moment(updatedAnniversaryDate);
  }

  const updatedDOB = ageCalculation(!isNil(get(elderPersona, 'dob')) ? get(elderPersona, 'dob') : '');
  const updatedMartialStatus = !isNil(get(elderPersona, 'marital_status')) ? get(elderPersona, 'marital_status') : '';
  const updatedLivingStatus = !isNil(get(elderPersona, 'living_status')) ? get(elderPersona, 'living_status') : '';
  const updatedWithRelative = !isNil(get(elderPersona, 'with_relative')) ? get(elderPersona, 'with_relative') : '';
  const updatedHomeSupport = !isNil(get(elderPersona, 'home_support')) ? get(elderPersona, 'home_support') : '';
  const updatedChildrenStatus = !isNil(get(elderPersona, 'children_satus')) ? get(elderPersona, 'children_satus') : '';
  const updatedHealthCondition = !isNil(get(elderPersona, 'health_condition')) ? get(elderPersona, 'health_condition') : '';
  const updatedHousingStatus = !isNil(get(elderPersona, 'housing_status')) ? get(elderPersona, 'housing_status') : '';
  const updatedEconomicStatus = !isNil(get(elderPersona, 'economic_status')) ? get(elderPersona, 'economic_status') : '';
  const updatedEducationalQualification = !isNil(get(elderPersona, 'educational_qualification')) ? get(elderPersona, 'educational_qualification') : '';
  const updatedProfessionalQualification = !isNil(get(elderPersona, 'professional_qualification')) ? get(elderPersona, 'professional_qualification') : '';
  const updatedSocialType = !isNil(get(elderPersona, 'social_type')) ? get(elderPersona, 'social_type') : '';
  const updatedTechnicalProfile = !isNil(get(elderPersona, 'technical_profile')) ? get(elderPersona, 'technical_profile') : '';
  const updatedActivityProfile = !isNil(get(elderPersona, 'activity_profile')) ? get(elderPersona, 'activity_profile') : '';
  const updatedTalentProfile = !isNil(get(elderPersona, 'talent_rofile')) ? get(elderPersona, 'talent_rofile') : '';

  useEffect(() => {
    if (updatedLivingStatus === 'with children') {
      setIsWithRelativeShown(true);
    }
  }, [elderPersona]);

  useEffect(() => {
    form.setFieldsValue({
      anniversary_date: updatedAnniversaryDate,
      age_cohort: updatedDOB,
      marital_status: updatedMartialStatus,
      living_status: updatedLivingStatus,
      with_relative: updatedWithRelative,
      home_support: updatedHomeSupport,
      children_satus: updatedChildrenStatus,
      health_condition: updatedHealthCondition,
      housing_status: updatedHousingStatus,
      economic_status: updatedEconomicStatus,
      educational_qualification: updatedEducationalQualification,
      professional_qualification: updatedProfessionalQualification,
      social_type: updatedSocialType,
      technical_profile: updatedTechnicalProfile,
      activity_profile: updatedActivityProfile,
      talent_rofile: updatedTalentProfile
    })
  }, [elderPersona]);

  return (
    <>
      {isLoading ? <Skeleton active /> : (
        <Form
          form={form}
          name="register"
          onFinish={values => handleOnFinish(
            values,
            postElderPersona
          )}
          scrollToFirstError
          className='socialTabElderPersonaForm'
          initialValues={{
            anniversary_date: updatedAnniversaryDate,
            age_cohort: updatedDOB,
            marital_status: updatedMartialStatus,
            living_status: updatedLivingStatus,
            with_relative: updatedWithRelative,
            home_support: updatedHomeSupport,
            children_satus: updatedChildrenStatus,
            health_condition: updatedHealthCondition,
            housing_status: updatedHousingStatus,
            economic_status: updatedEconomicStatus,
            educational_qualification: updatedEducationalQualification,
            professional_qualification: updatedProfessionalQualification,
            social_type: updatedSocialType,
            technical_profile: updatedTechnicalProfile,
            activity_profile: updatedActivityProfile,
            talent_rofile: updatedTalentProfile
          }}
        >
          <Row gutter={[16, 16]}>
            <ResponsiveGrid
              title='Anniversary Date'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='anniversary_date' rules={[{
                required: false,
                message: 'This field is required!'
              }]}>
                <DatePicker onChange={null} style={{ width: '100%' }} disabled={isNotErmOrErmSupervisor} />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Age Cohort'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='age_cohort'>
                <Select disabled style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="under_65">Under 65</Select.Option>
                  <Select.Option value="young_old">Young Old (65-74)</Select.Option>
                  <Select.Option value="middle_old">Middle Old (75-84)</Select.Option>
                  <Select.Option value="old_old">Old Old ({'>'}85)</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Marital Status'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='marital_status' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="single">Single (Not Married)</Select.Option>
                  <Select.Option value="married">Married</Select.Option>
                  <Select.Option value="divorced">Divorced</Select.Option>
                  <Select.Option value="widowed">Widowed</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Living Status'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='living_status' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={value => onChange(value, setIsWithRelativeShown)}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="alone">Alone</Select.Option>
                  <Select.Option value="with spouse">With Spouse</Select.Option>
                  <Select.Option value="with children">With Children</Select.Option>
                </Select>
              </Form.Item>

              {isWithRelativeShown && (
                <Form.Item label={null} className='mb-0' name='with_relative' rules={[{
                  required: true,
                  message: 'This field is required!'
                }]}>
                  <Select style={{ width: '100%' }} onChange={null}>
                    <Select.Option value="">Select One</Select.Option>
                    <Select.Option value="with son">With Son</Select.Option>
                    <Select.Option value="with daughter">With Daughter</Select.Option>
                    <Select.Option value="with son daughter">With Son & Daughter</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Home Support'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='home_support' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="full time maid">Full Time Maid</Select.Option>
                  <Select.Option value="care partner 12 hour">Care Partner 12 hour</Select.Option>
                  <Select.Option value="care partner 24 hours">Care Partner 24 hours</Select.Option>
                  <Select.Option value="care angel 12 hour">Care Angel 12 hour</Select.Option>
                  <Select.Option value="care angel 24 hours">Care Angel 24 Hours</Select.Option>
                  <Select.Option value="part time maid">Part time Maid</Select.Option>
                  <Select.Option value="driver">Driver</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Children Status'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='children_satus' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="joint family">Joint Family</Select.Option>
                  <Select.Option value="same city">Same City</Select.Option>
                  <Select.Option value="outside city">Outside City</Select.Option>
                  <Select.Option value="outside india">Outside India</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Health Condition'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='health_condition' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="healthy">Healthy</Select.Option>
                  <Select.Option value="chronic">Chronic</Select.Option>
                  <Select.Option value="acute">Acute</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Housing Status'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='housing_status' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="bungalow">Bungalow/Villa</Select.Option>
                  <Select.Option value="apartment">Apartment/Condo</Select.Option>
                  <Select.Option value="floor">Floor/Independent House</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Economic Status'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='economic_status' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="hni">HNI</Select.Option>
                  <Select.Option value="hig">HIG</Select.Option>
                  <Select.Option value="mig">MIG</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Educational Qualification'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='educational_qualification' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="professional">Professional</Select.Option>
                  <Select.Option value="technical">Technical</Select.Option>
                  <Select.Option value="life educated">Life Educated</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Professional Qualification'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='professional_qualification' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="professional">Professional</Select.Option>
                  <Select.Option value="business">Business</Select.Option>
                  <Select.Option value="government">Government</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Social Type'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='social_type' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="extrovert">Extrovert</Select.Option>
                  <Select.Option value="ambivert">Ambivert</Select.Option>
                  <Select.Option value="introvert">Introvert</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Technical Profile'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='technical_profile' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="tech proficient">Tech Proficient</Select.Option>
                  <Select.Option value="tech satisfactory">Tech Satisfactory</Select.Option>
                  <Select.Option value="tech challenged">Tech Challenged</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Activity Profile'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='activity_profile' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="active willing">Active and Willing</Select.Option>
                  <Select.Option value="active not willing">Active not Willing</Select.Option>
                  <Select.Option value="inactive not willing">Inactive and not Willing</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Talent Profile'
              direction='vertical'
            >
              <Form.Item label={null} className='mb-0' name='talent_rofile' rules={[{
                required: true,
                message: 'This field is required!'
              }]}>
                <Select disabled={isNotErmOrErmSupervisor} style={{ width: '100%' }} onChange={null}>
                  <Select.Option value="">Select One</Select.Option>
                  <Select.Option value="talented hobbies">Talented Hobbies</Select.Option>
                  <Select.Option value="no major talent">No major Talent</Select.Option>
                  <Select.Option value="willing to learn">Willing to Learn</Select.Option>
                </Select>
              </Form.Item>
            </ResponsiveGrid>
          </Row>

          <Form.Item {...tailLayout} className='mb-0 text-right'>
            <Space direction='horizontal'>
              <Button
                loading={isElderPersonaUpdating}
                type="primary"
                htmlType='submit'
                disabled={isNotErmOrErmSupervisor || isElderPersonaUpdating}
              >
                Save
              </Button>
              <Button
                type="default"
                disabled={isNotErmOrErmSupervisor || isElderPersonaUpdating}
                onPress={() => form.resetFields()}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </>
  );
}

ElderPersona.propTypes = {
  postElderPersona: PropTypes.func
};

export default memo(ElderPersona);
