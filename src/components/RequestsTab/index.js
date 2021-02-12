import React from 'react';
import styles from './requests-tab.scss';
import ElderConciergeRequests from '../ElderConciergeRequests';

class RequestsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className='emergency-tab' style={styles}>
        <ElderConciergeRequests {...this.props} />
      </div>
    );
  }

  componentWillUnmount() {}
}

export default RequestsTab;
