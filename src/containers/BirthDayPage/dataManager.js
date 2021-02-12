import DashboardService from '../../service/DashboardService';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Badge, Card, Tag } from 'antd';
import { isEqual, get, isEmpty } from 'lodash';
import {
  SyncOutlined,
  ChromeOutlined,
} from '@ant-design/icons';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7)
};
export default class DashboardDataManager {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  getUsersLocation = () => {
    return this.dashboardService
      .getUserLocations()
      .then((responseData) => {
        if (responseData) {
          return responseData.data;
        }
      })
      .catch((errorData) => {
        throw errorData;
      });
  };

  getBirthDayList = () => {
    return this.dashboardService
      .getBirthDayList()
      .then((responseData) => {
        if (responseData) {
          return responseData.data;
        }
      })
      .catch((errorData) => {
        throw errorData;
      });
  };

}

const isBetweenDates = (dob, start, end, isToday, isTomorrow) => {
  return moment(`${dob}`).isBetween(`${start}`, `${end}`) && !isTomorrow && !isToday;
}

const getRenderDOB = (data) => {
  if (data) {
    const elderDob = moment(data).endOf('day').format('DD-MM');
    const mockedElderDobWithCurrentYear = `${elderDob}-${new Date().getFullYear()}`;

    const startOfWeek = moment().startOf('isoWeek').format('DD-MM-YYYY');
    const lastOfWeek = moment().endOf('isoWeek').format('DD-MM-YYYY');

    const nextStartOfWeek = moment(startOfWeek).startOf('isoWeek').add(1, 'week').format('DD-MM-YYYY');
    const nextLastOfWeek = moment(lastOfWeek).endOf('isoWeek').add(1, 'week').format('DD-MM-YYYY');

    const currentMonth = new Date().getMonth();
    const dobMonth = new Date(data).getMonth();

    const isToday = isEqual(mockedElderDobWithCurrentYear, moment().format('DD-MM-YYYY'));
    const isTomorrow = isEqual(mockedElderDobWithCurrentYear, moment().add(1, 'day').format('DD-MM-YYYY'));

    if (currentMonth === dobMonth) {
      if (isBetweenDates(mockedElderDobWithCurrentYear, startOfWeek, lastOfWeek, isToday, isTomorrow)) {
        return <Tag color="green">This Week , {moment(data).format('DD-MM-YYYY')}</Tag>
      }

      if (isBetweenDates(mockedElderDobWithCurrentYear, nextStartOfWeek, nextLastOfWeek, isToday, isTomorrow)) {
        return <Tag color="orange">Second Week , {moment(data).format('DD-MM-YYYY')}</Tag>
      }

      if (isToday) {
        return <Tag icon={<ChromeOutlined spin />} color="#780001">Today</Tag>
      }

      if (isTomorrow) {
        return <Tag icon={<SyncOutlined spin />} color="processing">Tomorrow</Tag>
      }
      return <Tag color="red">Third Week , {moment(data).format('DD-MM-YYYY')}</Tag>
    } else {
      if (isBetweenDates(mockedElderDobWithCurrentYear, startOfWeek, lastOfWeek)) {
        return <Tag color="green">First Week of {monthNames[dobMonth]}, {moment(data).format('DD-MM-YYYY')}</Tag>
      }

      if (isBetweenDates(mockedElderDobWithCurrentYear, nextStartOfWeek, nextLastOfWeek)) {
        return <Tag color="orange">Second Week of {monthNames[dobMonth]}, {moment(data).format('DD-MM-YYYY')}</Tag>
      }

      return <Tag color="red">Third Week of {monthNames[dobMonth]}, {moment(data).format('DD-MM-YYYY')}</Tag>
    }

  }

}
export const columns = [
  {
    title: 'Name',
    width: 150,
    dataIndex: 'full_name',
    key: 'full_name',
    render: (text, record) => {
      if(text){
        return (
          <Link
            to={`elder/details/${record.id}`}
            title='View Details'
          >
            {text}
          </Link>
        )
      }
      return "N/A"
    },
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    render: (text, record) => {
      return <div>{record.age}</div>
    },
  },
  {
    title: 'Birthdays Week',
    width: 200,
    dataIndex: 'week',
    key: 'week',
    render: (text, record) => {
      return <div>{getRenderDOB(record.dob)}</div>
    }
  },
  {
    title: 'Contact Number',
    dataIndex: 'mobile_number',
    key: 'mobile_number',
    width: 300,
  },
  {
    title: 'ERM/NO',
    width: 150,
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: 'Plan Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    render: (text) => text || "N/A"
  },
];
