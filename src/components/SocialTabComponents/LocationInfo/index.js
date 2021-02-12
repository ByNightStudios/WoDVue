/**
 *
 * LocationInfo
 *
 */

import React, { memo, useState, useEffect } from 'react';
import {
  Form,
  Row,
  Button,
  Space,
  Select,
  Input,
  Skeleton
} from 'antd';
import { get, isNil } from 'lodash';

import CustomTagInput from '../../CustomTagInput';
import ResponsiveGrid from '../../ResponsiveGrid';
import { countries } from '../../../utils/staticDropDowns';

import './styles.scss';

const tailLayout = {
  wrapperCol: {
    span: 24
  },
};

const updateTags = (updatedTags, setTags) => setTags(updatedTags);
function LocationInfo(props) {
  const [form] = Form.useForm();
  const [citiesLivedIn, setCitiesLivedIn] = useState([]);

  const {
    isNotErmOrErmSupervisor,
    isLoading,
    isLocationUpdating,
    location,
    locationFormSubmit
  } = props;

  const updatedCities = !isNil(get(location, 'cities')) ? get(location, 'cities') : [];
  const updatedCountries = !isNil(get(location, 'countries')) ? get(location, 'countries') : [];
  const updatedNativePlace = !isNil(get(location, 'native_place')) ? get(location, 'native_place') : '';

  const handleFormFinish = values => {
    locationFormSubmit(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      cities: citiesLivedIn
    });
  }, [citiesLivedIn]);

  useEffect(() => {
    setCitiesLivedIn(updatedCities);

    form.setFieldsValue({
      countries: updatedCountries,
      native_place: updatedNativePlace
    });
  }, [location]);

  return (
    <>
      {isLoading ? <Skeleton /> : (
        <>
          <Form
            form={form}
            name="register"
            onFinish={handleFormFinish}
            scrollToFirstError
            className='socialTabLocationForm'
            initialValues={{
              cities: updatedCities,
              countries: updatedCountries,
              native_place: updatedNativePlace
            }}
          >
            <Row gutter={[16, 16]}>
              <ResponsiveGrid
                title='Cities Lived In'
              >
                <Form.Item label={null} name="cities" className='mb-0'>
                  <CustomTagInput
                    tags={citiesLivedIn}
                    updateTags={updatedTags => updateTags(updatedTags, setCitiesLivedIn)}
                    newTagText='Add City'
                    isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
                  />
                </Form.Item>
              </ResponsiveGrid>

              <ResponsiveGrid
                title='Countries Lived In'
              >
                <Form.Item label={null} name="countries" className='mb-0'>
                  <Select
                    disabled={isNotErmOrErmSupervisor}
                    showSearch
                    mode="multiple"
                    allowClear
                    placeholder="Please Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {countries.map(country => <Option
                      key={country.code}
                      value={country.name}
                    >
                      {country.name}
                    </Option>
                    )}
                  </Select>
                </Form.Item>
              </ResponsiveGrid>

              <ResponsiveGrid
                title='Native Place'
              >
                <Form.Item label={null} name="native_place" className='mb-0'>
                  <Input disabled={isNotErmOrErmSupervisor} />
                </Form.Item>
              </ResponsiveGrid>
            </Row>

            <Form.Item {...tailLayout} className='mb-0 text-right'>
              <Space direction='horizontal'>
                <Button
                  type="primary"
                  htmlType='submit'
                  disabled={isNotErmOrErmSupervisor || isLocationUpdating}
                  loading={isLocationUpdating}
                >
                  Save
                </Button>

                <Button
                  type="default"
                  disabled={isNotErmOrErmSupervisor || isLocationUpdating}
                  onClick={() => {
                    form.resetFields();
                    setCitiesLivedIn(updatedCities);
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form >
        </>
      )}
    </>
  );
}

LocationInfo.propTypes = {};

export default memo(LocationInfo);
