import React from 'react';
import * as _ from 'lodash';

import { OPENTOK_KEY } from '../../common/backendConstants';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import SubHeader from '../../components/SubHeader';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';

import { getRenderingHeader } from '../../common/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faVideoSlash,
  faMicrophoneSlash,
  faPhoneSlash,
  faMicrophone,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { createSession, OTPublisher, OTSubscriber } from 'opentok-react';

import VideoService from '../../service/VideoService';
import requireAuth from '../../hoc/requireAuth';
import styles from './video-support-page.scss';
import { notification } from 'antd';
import OTClient from '@opentok/client';
import hasPermission from '../../hoc/hasPermission';

global.OT = OTClient;

class VideoSupportPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVideoEnabled: true,
      isAudioEnabled: true,
      navigationDeployed: false,
      isLoadMore: false,
      isSendEnabled: true,
      activeCalls: [],
      loader: false,
      isCallActive: false,
      currentCall: null,
      streams: [],
    };

    this.activeCallsInterval = undefined;
    this.videoService = new VideoService();

    this.sessionHelper = null;
  }

  startLoader = () => {
    this.setState({ loader: true });
  };

  stopLoader = () => {
    this.setState({ loader: false });
  };

  componentDidMount() {
    document.title = 'Emoha Admin | Video Support';
    this.getActiveCalls(true);
    this.startAutoLoader();
  }

  startAutoLoader = () => {
    this.activeCallsInterval = setInterval(() => {
      this.getActiveCalls();
    }, 10000);
  };

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Video Support</h2>];

    const rightChildren = [];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  toggleVideo = () => {
    this.setState((state) => ({ isVideoEnabled: !state.isVideoEnabled }));
  };

  toggleAudio = () => {
    this.setState((state) => ({ isAudioEnabled: !state.isAudioEnabled }));
  };

  openNotification = (message, description, status) => {
    let style = { color: 'green' };
    if (!status)
      style = {
        color: 'red',
      };
    const args = {
      message,
      description,
      duration: 5,
      style,
    };
    notification.open(args);
  };

  getActiveCalls = (showLoader = false) => {
    if (showLoader) {
      this.startLoader();
    }

    this.videoService
      .getActiveCalls()
      .then((res) => {
        this.setState({ activeCalls: res.data, loader: false });
      })
      .catch((err) => {
        this.openNotification(
          'Error',
          'Something went wrong with the updating active calls list.',
          0
        );
        this.stopLoader();
      });
  };

  joinCallHandler = (call) => {
    if (this.state.isCallActive || call.room_status !== 1) {
      return;
    } else {
      this.startLoader();
      this.videoService
        .joinRoom({ conference_room_id: call.id })
        .then((res) => {
          this.sessionHelper = createSession({
            apiKey: OPENTOK_KEY,
            sessionId: call.session_id,
            token: res.data.token,
            onStreamsUpdated: (streams) => {
              this.setState({ streams });
            },
          });

          this.sessionHelper.session.on({
            streamCreated: (event) => {
              console.log('Publisher stream created!', event);
              this.getActiveCallMembers();
            },
            streamDestroyed: (event) => {
              console.log('Publisher stream destroyed!', event);
              this.getActiveCallMembers();
            },
          });

          this.setState({
            currentCall: { ...res.data, call },
            loader: false,
            isCallActive: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.openNotification(
            'Error',
            'Something went wrong while trying to join this call.',
            0
          );
          this.stopLoader();
        });
    }
  };

  disconnectCallHandler = () => {
    this.startLoader();
    this.videoService
      .disconnectCall({ conference_room_id: this.state.currentCall.call.id })
      .then((res) => {
        this.sessionHelper.disconnect();

        this.setState(
          {
            isCallActive: false,
            currentCall: null,
            loader: false,
            streams: [],
            isVideoEnabled: true,
            isAudioEnabled: true,
          },
          () => {
            this.sessionHelper = null;
            this.getActiveCalls(false);
          }
        );
      })
      .catch((err) => {
        this.openNotification(
          'Something went wrong while disconnecting this call.',
          0
        );
        this.stopLoader();
      });
  };

  getActiveCallMembers = () => {
    if (
      !this.state.isCallActive ||
      !this.state.currentCall ||
      !this.state.currentCall.call
    ) {
      return;
    }

    this.videoService
      .getActiveCallMembers(this.state.currentCall.call.id)
      .then((res) => {
        if (res.data) {
          let currentCall = this.state.currentCall;
          currentCall.attendees = res.data.attendees;
          this.setState({ currentCall });
        }
      })
      .catch((err) => {
        console.log('Error fetching call members');
      });
  };

  render() {
    const {
      navigationDeployed,
      isVideoEnabled,
      isAudioEnabled,
      activeCalls,
      isCallActive,
      currentCall,
      streams,
    } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'video-page sidebar-page sidebar-page--open position-relative'
              : 'video-page sidebar-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type='button'
              className='btn btn-trigger'
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001"  />
            </Button>
          )}

          <main className='sidebar-page-wrapper position-relative'>
            {/* Include the Sub Header on the Page */}
            {this.getRenderingSubHeader()}

            <div className='internal-content'>
              <div className='support-sidebar d-flex flex-column align-items-center justify-content-start'>
                <div className='support-sidebar-header'>
                  <h5>Calls Queue</h5>
                </div>

                <div className='support-sidebar-content'>
                  {activeCalls && activeCalls.length
                    ? activeCalls.map((caller, index) => {
                        return (
                          <Button
                            key={index}
                            type='button'
                            className={`channel-item d-flex align-items-end justify-content-between`}
                          >
                            <div className='channel-item-left text-left'>
                              <p>Name: {_.get(caller, 'full_name', '')}</p>
                              <p>Time: {_.get(caller, 'created_at', '')}</p>
                              <p>
                                Contact: {_.get(caller, 'formatted_number', '')}
                              </p>
                            </div>

                            {!isCallActive && caller.room_status === 1 ? (
                              <div
                                className='channel-item-right text-right'
                                onClick={() => this.joinCallHandler(caller)}
                              >
                                <span className='notification-pill d-flex align-items-center justify-content-center'>
                                  Join Call
                                </span>
                              </div>
                            ) : (
                              <></>
                            )}
                          </Button>
                        );
                      })
                    : 'No Active Calls'}
                </div>
              </div>

              <div className='support-messages d-flex flex-column align-items-center justify-content-start'>
                {isCallActive ? (
                  <React.Fragment>
                    <div className='support-messages-header'>
                      <h4>
                        Name: {_.get(currentCall, 'call.full_name', 'N/A')}
                      </h4>
                      <p>
                        Contact:{' '}
                        {_.get(currentCall, 'call.formatted_number', 'N/A')}
                      </p>
                    </div>

                    <div className='support-messages-content d-flex align-items-center justify-content-start'>
                      <div className='video-pod'>
                        <OTPublisher
                          session={this.sessionHelper.session}
                          properties={{
                            width: '100%',
                            fitMode: 'cover',
                            resolution: '1280x720',
                            height: '330px',
                            showControls: false,
                            mirror: false,
                            publishAudio: isAudioEnabled,
                            publishVideo: isVideoEnabled,
                          }}
                        />
                      </div>
                      {streams &&
                        streams.length !== 0 &&
                        streams.map((stream) => {
                          return (
                            <div key={stream.id} className='video-pod'>
                              <OTSubscriber
                                style={{ width: '100%' }}
                                session={this.sessionHelper.session}
                                stream={stream}
                                properties={{
                                  width: '100%',
                                  fitMode: 'cover',
                                  resolution: '1280x720',
                                  height: '330px',
                                  showControls: false,
                                  mirror: false,
                                }}
                              />
                            </div>
                          );
                        })}
                    </div>

                    <div className='support-messages-footer position-relative'>
                      <Button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() => this.toggleVideo()}
                      >
                        <FontAwesomeIcon
                          icon={isVideoEnabled ? faVideoSlash : faVideo}
                        />
                        Toggle Video
                      </Button>
                      <Button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() => this.toggleAudio()}
                      >
                        <FontAwesomeIcon
                          icon={
                            isAudioEnabled ? faMicrophoneSlash : faMicrophone
                          }
                        />
                        Toggle Audio
                      </Button>
                      <Button
                        type='button'
                        className='btn btn-secondary'
                        onClick={this.disconnectCallHandler}
                      >
                        <FontAwesomeIcon icon={faPhoneSlash} />
                        Leave Call
                      </Button>
                    </div>
                  </React.Fragment>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* ENABLE THIS PAGE LOADER CONDITIONALLY */}
        {this.state.loader ? <PageLoader /> : null}
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    if (this.activeCallsInterval) {
      clearInterval(this.activeCallsInterval);
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = {};

export default hasPermission(
  requireAuth(connect(mapStateToProps, mapDispatchToProps)(VideoSupportPage))
);
