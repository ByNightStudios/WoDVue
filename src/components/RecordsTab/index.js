import React, { Component } from 'react';
import ElderRecords from '../ElderRecord/index';
import styles from './records-tab.scss';

class index extends Component {
  render() {
    return (
      <div className='records-tab' style={styles}>
        <ElderRecords {...this.props} />
      </div>
    );
  }
}
export default index;
