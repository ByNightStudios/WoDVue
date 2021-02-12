import React from 'react';
import Pusher from 'pusher-js';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../common/constants';
import { addNotification } from '../actions/NotificationActions';
import { PUSHER_KEY, PUSHER_CLUSTER } from '../common/backendConstants';

import ButterBar from '../components/ButterBar';

export default (ChildComponent) => {
  class requireAuth extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        showButterBar: false,
        butterBarData: {},
      };

      // IMPORTANT - TURN OFF FOR PRODUCTION
      Pusher.logToConsole = true;

      this.pusherInstance = null;
      this.audioLoadContext = new AudioContext();
    }

    componentDidMount() {
      this.initializePusher();
    }

    initializePusher = () => {
      this.pusherInstance = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
      });

      this.pusherInstance.subscribe('admins');

      this.pusherInstance.bind('server-notification', (data) => {
        if (data) {
          const { user } = this.props.user;

          if (data.identifier.includes(user.id)) {
            delete data.identifier;

            this.props.addNotification(data);

            this.highPriorityNotification(data);
          }
        }
      });
    };

    highPriorityNotification = (data) => {
      const currentPath = window.location.pathname;

      let dataPayload = {
        contentText: data.message,
      };

      switch (data.type) {
        case 'ADMIN_VIDEO':
          if (currentPath === ROUTES.VIDEOSUPPORTPAGE) {
            return;
          }

          dataPayload = {
            ...dataPayload,
            highPriority: true,
            notificationType: 'video',
          };
          break;

        case 'chat':
          if (currentPath === ROUTES.SUPPORT) {
            return;
          }

          dataPayload = {
            ...dataPayload,
            highPriority: false,
            notificationType: 'chat',
          };
          break;

        default:
          this.setState({ showButterBar: false, butterBarData: {} });
          return;
      }

      this.setState({ butterBarData: dataPayload, showButterBar: true }, () => {
        if (dataPayload.notificationType === 'video') {
          this.playAudioAlert();
        }

        setTimeout(() => {
          this.setState({ showButterBar: false, butterBarData: {} });
          this.stopAudioAlert();
        }, data.callDuration);
      });
    };

    onViewHandler = (type) => {
      this.stopAudioAlert();

      switch (type) {
        case 'video':
          this.props.history.push(ROUTES.VIDEOSUPPORTPAGE);
          break;

        case 'chat':
          this.props.history.push(ROUTES.SUPPORT);
          break;

        default:
          break;
      }
    };

    playAudioAlert = () => {
      if (this.state.showButterBar) {
        this.audioLoadContext
          .resume()
          .then(() => {
            document.getElementById('hocAlertAudio').play();
          })
          .catch((err) => {
            console.log('Error While Playing Audio', err);
          });
      }
    };

    stopAudioAlert = () => {
      document.getElementById('hocAlertAudio').pause();
      document.getElementById('hocAlertAudio').currentTime = 0;
    };

    render() {
      const { butterBarData, showButterBar } = this.state;
      let is_logged_in = this.props.user.is_logged_in;
      if (!is_logged_in) {
        return <Redirect to='/log-in' />;
      }

      return (
        <React.Fragment>
          {showButterBar && (
            <ButterBar
              highPriority={butterBarData.highPriority}
              actionDestination={this.onViewHandler}
              contentText={butterBarData.contentText}
              notificationType={butterBarData.notificationType}
            />
          )}

          <ChildComponent {...this.props} />
        </React.Fragment>
      );
    }

    componentWillUnmount() {
      if (this.pusherInstance) {
        this.pusherInstance.disconnect();
      }
    }
  }

  const mapStateToProps = (state) => ({
    user: state.user,
  });

  const mapDispatchToProps = {
    addNotification,
  };

  return connect(mapStateToProps, mapDispatchToProps)(requireAuth);
};
