import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import { isEqual } from 'lodash';
import { SyncOutlined, ChromeOutlined } from '@ant-design/icons';
import DashboardService from '../../service/DashboardService';

Date.prototype.getWeek = function() {
  const onejan = new Date(this.getFullYear(), 0, 1);
  const today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  const dayOfYear = (today - onejan + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
};
export default class DashboardDataManager {
  constructor() {
    this.dashboardService = new DashboardService();
  }

  getUsersLocation = () =>
    this.dashboardService
      .getUserLocations()
      .then(responseData => {
        if (responseData) {
          return responseData.data;
        }
      })
      .catch(errorData => {
        throw errorData;
      });

  getBirthDayList = () =>
    this.dashboardService
      .getBirthDayList()
      .then(responseData => {
        if (responseData) {
          return responseData.data;
        }
      })
      .catch(errorData => {
        throw errorData;
      });

  getPlanList = () =>
    this.dashboardService
      .getPlanList()
      .then(responseData => {
        if (responseData) {
          return responseData.data;
        }
      })
      .catch(errorData => {
        throw errorData;
      });
}

const isBetweenDates = (dob, start, end, today, tomorrow) =>
  moment(dob).isBetween(start, end, undefined, '[]') && !today && !tomorrow;

const getRenderDOB = data => {
  if (data) {
    const elderDob = moment(data)
      .endOf('day')
      .format('MM-DD');
    const mockedElderDobWithCurrentYear = `${new Date().getFullYear()}-${elderDob}`;

    const startOfWeek = moment()
      .startOf('week')
      .format('YYYY-MM-DD');
    const lastOfWeek = moment()
      .endOf('week')
      .format('YYYY-MM-DD');

    const nextStartOfWeek = moment()
      .startOf('week')
      .add(1, 'week')
      .format('YYYY-MM-DD');
    const nextLastOfWeek = moment()
      .endOf('week')
      .add(1, 'week')
      .format('YYYY-MM-DD');

    const nextStartOfSecondWeek = moment()
      .startOf('week')
      .add(2, 'week')
      .format('YYYY-MM-DD');
    const nextLastOfSecondWeek = moment()
      .endOf('week')
      .add(2, 'week')
      .format('YYYY-MM-DD');

    const nextStartOfThirdWeek = moment()
      .startOf('week')
      .add(3, 'week')
      .format('YYYY-MM-DD');
    const nextLastOfThirdWeek = moment()
      .endOf('week')
      .add(3, 'week')
      .format('YYYY-MM-DD');

    const isToday = isEqual(
      mockedElderDobWithCurrentYear,
      moment().format('YYYY-MM-DD'),
    );
    const isTomorrow = isEqual(
      mockedElderDobWithCurrentYear,
      moment()
        .add(1, 'day')
        .format('YYYY-MM-DD'),
    );

    if (
      isBetweenDates(
        mockedElderDobWithCurrentYear,
        startOfWeek,
        lastOfWeek,
        isToday,
        isTomorrow,
      )
    ) {
      return (
        <Tag color="green">This Week, {moment(data).format('DD-MM-YYYY')}</Tag>
      );
    }

    if (
      isBetweenDates(
        mockedElderDobWithCurrentYear,
        nextStartOfWeek,
        nextLastOfWeek,
        isToday,
        isTomorrow,
      )
    ) {
      return (
        <Tag color="orange">
          Second Week , {moment(data).format('DD-MM-YYYY')}
        </Tag>
      );
    }

    if (
      isBetweenDates(
        mockedElderDobWithCurrentYear,
        nextStartOfSecondWeek,
        nextLastOfSecondWeek,
        isToday,
        isTomorrow,
      )
    ) {
      return (
        <Tag color="blue">Third Week, {moment(data).format('DD-MM-YYYY')}</Tag>
      );
    }

    if (
      isBetweenDates(
        mockedElderDobWithCurrentYear,
        nextStartOfThirdWeek,
        nextLastOfThirdWeek,
        isToday,
        isTomorrow,
      )
    ) {
      return (
        <Tag color="purple">
          Fourth Week, {moment(data).format('DD-MM-YYYY')}
        </Tag>
      );
    }

    if (isToday) {
      return (
        <Tag icon={<ChromeOutlined spin />} color="#780001">
          Today
        </Tag>
      );
    }

    if (isTomorrow) {
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Tomorrow
        </Tag>
      );
    }
  }
  return (
    <Tag color="cyan">Upcoming Week, {moment(data).format('DD-MM-YYYY')}</Tag>
  );
};
export const columns = [
  {
    title: 'Name',
    width: 150,
    dataIndex: 'full_name',
    key: 'full_name',
    render: (text, record) => {
      if (text) {
        return (
          <Link to={`elder/details/${record.id}`} title="View Details">
            {text}
          </Link>
        );
      }
      return 'N/A';
    },
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    render: (text, record) => <div>{record.age}</div>,
  },
  {
    title: 'Birthdays',
    width: 200,
    dataIndex: 'week',
    key: 'week',
    render: (text, record) => <div>{getRenderDOB(record.dob)}</div>,
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
    render: text => text || 'N/A',
  },
];

export const expireColumns = [
  {
    title: 'Created At',
    width: 150,
    dataIndex: 'customer_creation_date',
    key: 'customer_creation_date',
    render: text => moment(text).format('DD/MM/YYYY') || 'N/A',
  },
  {
    title: 'Customer Id',
    width: 100,
    dataIndex: 'customer_id',
    key: 'customer_id',
    render: text => text || 'N/A',
  },
  {
    title: 'Name',
    width: 100,
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: 'Days Left',
    width: 100,
    dataIndex: 'days_left',
    key: 'days_left',
  },
  {
    title: 'Contact Number',
    dataIndex: 'mobile_number',
    key: 'mobile_number',
    width: 100,
    render: text => text || 'N/A',
  },
  {
    title: 'ERM',
    width: 150,
    dataIndex: 'erm_first_name',
    key: 'erm_first_name',
    render: text => text || 'N/A',
  },
  {
    title: 'Plan Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    render: text => text || 'N/A',
  },
  {
    title: 'Expiry Date',
    width: 100,
    dataIndex: 'expiry_date',
    key: 'expiry_date',
    render: text => moment(text).format('DD/MM/YYYY') || 'N/A',
  },
];
