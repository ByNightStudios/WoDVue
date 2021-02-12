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
  Switch,
  Select,
  Skeleton
} from 'antd';
import { get, isNil } from 'lodash';
import ResponsiveGrid from '../../ResponsiveGrid';
import CustomTagInput from '../../CustomTagInput';
import './styles.scss';
import { clubs, faiths, festivals } from '../../../utils/staticDropDowns';

const tailLayout = {
  wrapperCol: {
    span: 24
  },
};

const updateTags = (updatedTags, setTags) => setTags(updatedTags);

const handleFormFinish = (values, preferencesFormSubmit) => preferencesFormSubmit(values);
function Preferences(props) {
  const [form] = Form.useForm();
  const [hobbies, setHobbies] = useState([]);
  const [music, setMusic] = useState([]);
  const [tvShows, setTVShows] = useState([]);

  const {
    isNotErmOrErmSupervisor,
    preferences,
    isLoading,
    isPreferencesUpdating,
    preferencesFormSubmit
  } = props;

  const updatedInterestedInTravel = !isNil(get(preferences, 'interested_in_trave')) ? get(preferences, 'interested_in_trave') : false;
  const updatedGuestSpeaker = !isNil(get(preferences, 'guest_speake')) ? get(preferences, 'guest_speake') : false;
  const updatedFaith = !isNil(get(preferences, 'faith')) ? get(preferences, 'faith') : '';
  const updatedHobbies = !isNil(get(preferences, 'hobbies')) ? get(preferences, 'hobbies') : [];
  const updatedMusic = !isNil(get(preferences, 'favourite_music')) ? get(preferences, 'favourite_music') : [];
  const updatedTVShows = !isNil(get(preferences, 'tv_shows')) ? get(preferences, 'tv_shows') : [];
  const updatedClubsInterestedIn = !isNil(get(preferences, 'clubs_interested_in')) ? get(preferences, 'clubs_interested_in') : [];
  const updatedFestivalsCelebrated = !isNil(get(preferences, 'festivals_celebrated')) ? get(preferences, 'festivals_celebrated') : [];

  useEffect(() => {
    form.setFieldsValue({
      hobbies: hobbies,
      favourite_music: music,
      tv_shows: tvShows
    });
  }, [
    hobbies,
    music,
    tvShows
  ]);

  useEffect(() => {
    setHobbies(updatedHobbies);
    setMusic(updatedMusic);
    setTVShows(updatedTVShows);

    form.setFieldsValue({
      interested_in_trave: updatedInterestedInTravel,
      guest_speake: updatedGuestSpeaker,
      clubs_interested_in: updatedClubsInterestedIn,
      faith: updatedFaith,
      festivals_celebrated: updatedFestivalsCelebrated
    });
  }, [preferences]);

  return (
    <>
      {isLoading ? <Skeleton /> : (
        <Form
          form={form}
          name="register"
          onFinish={values => handleFormFinish(values, preferencesFormSubmit)}
          scrollToFirstError
          className='socialTabPreferencesForm'
          initialValues={{
            interested_in_trave: updatedInterestedInTravel,
            hobbies: updatedHobbies,
            favourite_music: updatedMusic,
            tv_shows: updatedTVShows,
            guest_speake: updatedGuestSpeaker,
            clubs_interested_in: updatedClubsInterestedIn,
            faith: updatedFaith,
            festivals_celebrated: updatedFestivalsCelebrated
          }}
        >
          <Row gutter={[16, 16]}>
            <ResponsiveGrid
              title='Interested in Travel?'
            >
              <Form.Item label={null} name='interested_in_trave' className='mb-0' valuePropName="checked">
                <Switch
                  checkedChildren='Yes'
                  unCheckedChildren='No'
                  disabled={isNotErmOrErmSupervisor}
                />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid title='Hobbies'>
              <Form.Item label={null} name="hobbies" className='mb-0'>
                <CustomTagInput
                  tags={hobbies}
                  updateTags={updatedTags => updateTags(updatedTags, setHobbies)}
                  newTagText='Add Hobby'
                  isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
                />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Favourite Music'
            >
              <Form.Item label={null} name="favourite_music" className='mb-0'>
                <CustomTagInput
                  tags={music}
                  updateTags={updatedTags => updateTags(updatedTags, setMusic)}
                  newTagText='Add Music'
                  isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
                />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='TV Shows'
            >
              <Form.Item label={null} name="tv_shows" className='mb-0'>
                <CustomTagInput
                  tags={tvShows}
                  updateTags={updatedTags => updateTags(updatedTags, setTVShows)}
                  newTagText='Add TV Shows'
                  isNotErmOrErmSupervisor={isNotErmOrErmSupervisor}
                />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Guest Speaker?'
            >
              <Form.Item label={null} name="guest_speake" className='mb-0' valuePropName="checked">
                <Switch
                  checkedChildren='Yes'
                  unCheckedChildren='No'
                  disabled={isNotErmOrErmSupervisor}
                />
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Clubs Interested In?'
            >
              <Form.Item label={null} name="clubs_interested_in" className='mb-0'>
                <Select
                  allowClear
                  mode="multiple"
                  placeholder="Please Select"
                  disabled={isNotErmOrErmSupervisor}
                >
                  {clubs.map(club => <Select.Option
                    key={club.key} value={club.name}
                  >
                    {club.name}
                  </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Faith'
            >
              <Form.Item label={null} name="faith" className='mb-0'>
                <Select disabled={isNotErmOrErmSupervisor}>
                  <Select.Option value=''>Select One</Select.Option>
                  {faiths.map(faith => <Select.Option
                    key={faith.key}
                    value={faith.name}
                  >
                    {faith.name}
                  </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </ResponsiveGrid>

            <ResponsiveGrid
              title='Festivals Celebrated'
            >
              <Form.Item label={null} name="festivals_celebrated" className='mb-0' rules={[{
                required: false,
                message: 'This field is required!'
              }]}>

                <Select
                  disabled={isNotErmOrErmSupervisor}
                  mode="multiple"
                  showSearch
                  placeholder="Please Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {festivals.map(festival => <Select.Option
                    key={festival.key}
                    value={festival.name}
                  >
                    {festival.name}
                  </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </ResponsiveGrid>

          </Row>

          <Form.Item {...tailLayout} className='mb-0 text-right'>
            <Space direction='horizontal'>
              <Button
                type="primary"
                htmlType='submit'
                disabled={isNotErmOrErmSupervisor || isPreferencesUpdating}
                loading={isPreferencesUpdating}
              >
                Save
              </Button>

              <Button
                type="default"
                disabled={isNotErmOrErmSupervisor || isPreferencesUpdating}
                onClick={() => {
                  form.resetFields();
                  setHobbies(updatedHobbies);
                  setMusic(updatedMusic);
                  setTVShows(updatedTVShows);
                }}
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

Preferences.propTypes = {};

export default memo(Preferences);
