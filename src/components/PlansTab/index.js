import React from 'react';
import get from 'lodash/get';

import PlansTabDataManager from './dataManager';
import ElderPlansList from '../ElderPlansList';
import ElderActivePlan from '../ElderActivePlan';

import styles from './plans-tab.scss';

class PlansTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remainingPlans: [],
      activePlan: null,
    };

    this.plansTabDataManager = new PlansTabDataManager();
  }

  componentDidMount() {
    this.getElderPlans();
  }

  getElderPlans = () => {
    this.props.startLoader();

    const dataPayload = {
      currentElderIdentifier: this.props.currentElderIdentifier,
    };

    this.plansTabDataManager
      .getElderPlans(dataPayload)
      .then((responsedata) => {
        this.props.stopLoader();

        if (responsedata.data) {
          const remainingPlans = get(responsedata.data, 'remainingPlans', []);
          const activePlan = get(responsedata.data, 'activePlan', []);

          this.setState({
            remainingPlans,
            activePlan,
          });
        }
      })
      .catch((errorData) => {
        this.props.stopLoader();
        const error = get(
          errorData,
          'response.data.message',
          'Something went wrong. Please try again later'
        );
        this.props.openNotification('Error', error, 0);
      });
  };

  render() {
    const { remainingPlans, activePlan } = this.state;

    return (
      <div className='plans-tab' style={styles}>
        <ElderActivePlan
          {...this.props}
          activePlan={activePlan}
          getElderPlans={this.getElderPlans}
        />
        <ElderPlansList {...this.props} plansList={remainingPlans} />
      </div>
    );
  }

  componentWillUnmount() {}
}

export default PlansTab;
