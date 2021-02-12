/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { message, Timeline, Typography, Descriptions, Card } from 'antd';
import moment from 'moment';
import { isEmpty, map, get } from 'lodash';
import EldersFriendsManager from './dataManager';
const EldersFriendsManagerInstance = new EldersFriendsManager();

message.config({
  top: 80,
  maxCount: 1,
});

const { Text } = Typography;

function viewNotes(props) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const payload = {
      id: get(props, 'friendRecord.uuid', ''),
    };
    setLoading(true);
    EldersFriendsManagerInstance.getElderFriendNotes(payload)
      .then(res => {
        if (res) {
          setNotes(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err) {
          message.error('something went wrong');
          setLoading(false);
        }
      });
  }, []);

  function renderTimeline() {
    if (isEmpty(notes)) {
      return <Text>No Notes Found</Text>;
    }

    function renderCallStatus(item) {
      switch (item) {
        case 1:
          return 'Interested';
        case 2:
          return 'Not Contactable';
        case 3:
          return 'Not Interested';
        case 4:
          return 'Not Qualified';
        case 5:
          return 'Requested Call Back';
        default:
          return 'N/A';
      }
    }

    return (
      <Timeline mode="alternate">
        {map(notes, item => (
          <Timeline.Item>
            <Card>
              <Descriptions
                title={moment(item.created_at).format('DD/MM/YYYY hh:mm:ss a')}
              >
                <Descriptions.Item label="Notes" span={24}>
                  {item.note}
                </Descriptions.Item>
                <Descriptions.Item label="Call Status" span={24}>
                  {renderCallStatus(item.call_status)}
                </Descriptions.Item>
                <Descriptions.Item label="ERM Name" span={24}>
                  {get(item,'user.first_name', 'n/a')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }
  return renderTimeline();
}

export default viewNotes;
