import React from 'react';

import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';

import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../components/SubHeader';
import PageLoader from '../../components/PageLoader';
import SideNavigation from '../../components/SideNavigation';
import { getRenderingHeader } from '../../common/helpers';
import { faCaretRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import styles from './support-page.scss';
import requireAuth from '../../hoc/requireAuth';
import {
  getChats,
  getMessages,
  sendMessages,
  updateUnreadCount,
  getChatsUsers,
} from '../../actions/ChatActions';
import Pusher from 'pusher-js';
import { PUSHER_CLUSTER, PUSHER_KEY } from '../../common/backendConstants';
import * as _ from 'lodash';
import { Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import hasPermission from '../../hoc/hasPermission';

class SupportPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationDeployed: true,
      users: [],
      chats: [],
      selectedChat: null,
      newChat: null,
      messages: [],
      text: '',
      loader: true,
      search: '',
      page: 0,
      isLoadMore: false,
      isSendEnabled: true,
    };

    this.channel = null;
    this.pusherSend = null;
    this.pusherReceive = null;
    this.receiverChannel = null;
  }

  componentDidMount() {
    document.title = 'Emoha Admin | Support';

    this.pusherSend = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: `${config.BASEURLWEB}pusher/auth`,
    });

    this.pusherReceive = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: `${config.BASEURLWEB}pusher/auth`,
    });

    Pusher.logToConsole = true;

    this.channel = this.pusherSend.subscribe('private-admins');

    this.fetchChatsFromDatabase();

    this.messageHandler();
  }

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  getRenderingSubHeader = () => {
    const leftChildren = [<h2 key={0}>Chat Support</h2>];

    const rightChildren = [];

    return (
      <SubHeader leftChildren={leftChildren} rightChildren={rightChildren} />
    );
  };

  redirectedChatHandler = async chats => {
    const user = queryString.parse(window.location.search);
    console.log(user);

    if (user.id && chats && chats.length) {
      let existingChat = null;
      for (const chat of chats) {
        if (chat.user_id === user.id) {
          existingChat = chat;
          break;
        }
      }

      if (existingChat) {
        this.setState({ selectedChat: existingChat });
        this.getUserMessages(existingChat, false);
        // pusherReceive.disconnect();

        this.receiverChannel = await this.pusherReceive.subscribe(
          `private-${existingChat.user_id}`,
        );
        this.receiverChannel.bind('client-NewMessage', data => {

        });
      } else {
        const newChat = {
          user_id: user.id,
          full_name: user.name,
          formatted_mobile_number: user.mobile,
        };
        this.setState({ newChat, selectedChat: null, messages: [] });
        // pusherReceive.disconnect();

        this.receiverChannel = await this.pusherReceive.subscribe(
          `private-${newChat.user_id}`,
        );
        this.receiverChannel.bind('client-NewMessage', data => {

        });
        this.getUserMessages(newChat, true);
      }
    }
  };

  fetchChatsFromDatabase = async () => {
    this.props
      .getChats(this.state.page)
      .then(async response => {
        this.setState({ chats: response, loader: false }, () => {
          this.redirectedChatHandler(response);
        });
      })
      .catch(error => {
        this.setState({ loader: false });
        console.log(error);
      });
  };

  messageHandler = async () => {
    this.channel.bind('client-newMessage', async data => {
      console.log(data);

      if (data.type === 'message') {
        if (
          this.state.selectedChat &&
          data.chat.id === this.state.selectedChat.id &&
          data.message.message
        ) {
          console.log('new message by user, selected');
          const messageObj = {
            type: data.message.type,
            message: data.message.message,
            createdAt: data.message.createdAt,
          };

          let { messages } = this.state;
          messages = [...messages, messageObj];
          this.setState({ messages });
          let messagesDiv = document.getElementById('messagesDiv');
          console.log('messagesDiv', messagesDiv);
          if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } else {
          const updatedChat = data.chat;

          let { chats } = this.state;

          let oldChat = null;
          for (const chat of chats) {
            if (chat.id === updatedChat.id) {
              oldChat = chat;
              break;
            }
          }

          if (oldChat) {
            console.log('new message by user, in chats');

            const newChats = chats.filter(chat => chat.id !== updatedChat.id);

            console.log(oldChat);

            const updatedChatObj = {
              ...updatedChat,
              unread: parseInt(oldChat.unread) + 1,
            };

            console.log(updatedChatObj);

            chats = [updatedChatObj, ...newChats];
            this.setState({ chats });
          } else {
            console.log('new message by user, not in chats');
            const updatedChatObj = {
              ...updatedChat,
              unread: 1,
            };
            chats = [updatedChatObj, ...chats];
            this.setState({ chats });
          }
        }
      } else if (data.type === 'newChat') {
        console.log('new chat by admin');

        const updatedChat = data.chat;

        let { chats } = this.state;
        const updatedChatObj = {
          ...updatedChat,
          unread: 1,
        };

        chats = [updatedChatObj, ...chats];

        this.setState({ chats });
      }
    });
  };

  createNewChat = async e => {
    const user = this.state.users.filter(user => {
      if (user.id === e) return user;
    });

    for (const chat of this.state.chats) {
      if (chat.user_id === e) {
        this.setState({ selectedChat: chat, newChat: null });
        this.getUserMessages(chat, false);
        return;
      }
    }

    if (user) {
      const newChat = {
        user_id: e,
        first_name: user[0].full_name,
        formatted_mobile_number: user[0].formatted_mobile_number,
        chat: user[0].chat,
      };
      await this.setState({ newChat, selectedChat: null, messages: [] });
      console.log(this.state.newChat);
      this.getUserMessages(newChat, true);
    }
  };

  setSelectedChat = async selectedChat => {
    // pusherReceive.disconnect();
    this.receiverChannel = await this.pusherReceive.subscribe(
      `private-${selectedChat.user_id}`,
    );

    this.receiverChannel.bind('client-NewMessage', data => {

    });

    this.setState({ selectedChat, newChat: null });

    let { chats } = this.state;

    chats = await chats.map(chat =>
      chat.user_id === selectedChat.user_id ? { ...chat, unread: 0 } : chat,
    );

    this.setState({ chats, search: '', users: [] });

    this.getUserMessages(selectedChat, false);
  };

  getUserMessages = (chat, isNew = false) => {
    this.setState({ loader: true });
    this.props
      .getMessages(chat.user_id)
      .then(response => {
        this.setState({ messages: response });

        if (!isNew) this.props.updateUnreadCount(chat.id);

        const messagesDiv = document.getElementById('messagesDiv');
        if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
        this.setState({ loader: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loader: false });
      });
  };

  sendMessage = async isNewChat => {
    if (!this.state.text) return;

    let user_id;
    if (isNewChat) user_id = this.state.newChat.user_id;
    else user_id = this.state.selectedChat.user_id;

    this.setState({ isSendEnabled: false });
    const { text } = this.state;
    let { messages } = this.state;

    const newMessageObj = {
      message: {
        message: text,
        createdAt: moment().format('DD-MM-YYYY HH:mm'),
        type: 'admin',
      },
      chat: isNewChat ? this.state.newChat : this.state.selectedChat,
      type: isNewChat ? 'newChat' : 'message',
    };

    messages = [...messages, newMessageObj.message];
    console.log(newMessageObj);
    this.setState({ messages, text: '' });

    const messagesDiv = document.getElementById('messagesDiv');
    if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;

    this.channel.trigger('client-newMessage', newMessageObj);

    let { chats, selectedChat, newChat } = this.state;
    if (selectedChat) {
      selectedChat = { ...selectedChat, unread: 0 };
      const oldChats = chats.filter(chat => chat.id !== selectedChat.id);
      chats = [selectedChat, ...oldChats];
      this.setState({ chats, selectedChat, newChat: null });
    } else if (newChat) {
      newChat = { ...newChat, unread: 0 };
      const oldChats = chats.filter(chat => chat.id !== newChat.id);
      chats = [newChat, ...oldChats];
      this.setState({ chats, selectedChat: newChat, newChat: null });
    }

    this.receiverChannel.trigger('client-newMessage', newMessageObj);

    this.setState({ isSendEnabled: true });
    this.props.sendMessages(text, user_id).catch(error => {
      console.log(error);
    });
  };

  setTextMessage = e => {
    this.setState({ text: e.currentTarget.value });
  };

  setSearchValue = value => {
    this.setState({ search: value });
  };

  onKeyFormSubmission = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.sendMessage(!this.state.selectedChat);
    }
  };

  userSearchHandler = key => {
    if (!this.state.search || key !== 'Enter') return;

    this.props
      .getChatsUsers(this.state.search)
      .then(res => {
        this.setState({ users: res });
      })
      .catch(error => {
        console.log(error);
      });
  };

  scrollLoadChatsHandler = () => {
    if (this.state.isLoadMore) return;
    const { page } = this.state;
    this.setState({ page: page + 1, isLoadMore: true });
    this.props
      .getChats(page + 1)
      .then(res => {
        if (res.length) {
          const { chats } = this.state;
          const updatedChats = [...new Set(chats.concat(res))];
          this.setState({ chats: updatedChats, isLoadMore: false });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoadMore: false });
      });
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}

        <div
          className={
            navigationDeployed
              ? 'support-page sidebar-page sidebar-page--open position-relative'
              : 'support-page sidebar-page sidebar-page--closed position-relative'
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type="button"
              className="btn btn-trigger"
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            {/* Include the Sub Header on the Page */}
            {this.getRenderingSubHeader()}

            <div className="internal-content">
              <div className="support-sidebar d-flex flex-column align-items-center justify-content-start">
                <div className="support-sidebar-header">
                  <h5>Customers</h5>

                  <div className="global-search">
                    <Form.Group
                      className="position-relative"
                      controlId="searchChannels"
                    >
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        showArrow
                        notFoundContent={
                          this.state.search === '' || this.state.search === null
                            ? null
                            : ''
                        }
                        onInputKeyDown={e => this.userSearchHandler(e.key)}
                        defaultActiveFirstOption={false}
                        onSearch={value => this.setSearchValue(value)}
                        onChange={e => this.createNewChat(e)}
                        placeholder="Search for customers"
                        filterOption={false}
                      >
                        {this.state.users.map((user, index) => (
                          <Select.Option
                            key={user.id}
                            value={user.id}
                            data-full_namer={`${user.first_name} ${user.last_name}`}
                            data-chat={user.chat}
                            data-formatted_mobile_number={
                              user.formatted_mobile_number
                            }
                          >{`(${user.first_name} ${user.last_name})  (${user.formatted_mobile_number})`}</Select.Option>
                        ))}
                      </Select>
                    </Form.Group>
                  </div>
                </div>

                <div
                  className="support-sidebar-content"
                  ref={ref => (this.scrollParentRef = ref)}
                >
                  <InfiniteScroll
                    threshold={0}
                    initialLoad={false}
                    hasMore
                    useWindow={false}
                    getScrollParent={() => this.scrollParentRef}
                    loadMore={
                      this.state.isLoadMore
                        ? () => {}
                        : () => this.scrollLoadChatsHandler()
                    }
                  >
                    {this.state.chats.length ? (
                      this.state.chats.map((user, index) => (
                        <Button
                          key={index}
                          onClick={() => this.setSelectedChat(user)}
                          type='button'
                          className={`channel-item ${
                            this.state.selectedChat &&
                            this.state.selectedChat.user_id === user.user_id
                              ? `channel-item--active`
                              : ``
                          } d-flex align-items-end justify-content-between`}
                        >
                          <div className='channel-item-left text-left'>
                            <h6>
                              {user.first_name
                                ? `${user.first_name}  ${user.last_name}`
                                : 'Unnamed Contact'}
                            </h6>
                            <p>Contact: {user.formatted_mobile_number}</p>
                          </div>

                          {user.unread && user.unread > 0 ? (
                            <div className='channel-item-right text-right'>
                              <span className='notification-pill d-flex align-items-center justify-content-center'>
                                {`${user.unread} unread`}
                              </span>
                            </div>
                          ) : null}
                        </Button>
                      ))
                    ) : (
                      <div className="support-sidebar-header">
                        <h5>No Customers Found</h5>
                      </div>
                    )}
                  </InfiniteScroll>
                </div>
              </div>

              <div className="support-messages d-flex flex-column align-items-center justify-content-start">
                {(this.state.selectedChat || this.state.newChat) && (
                  <React.Fragment>
                    {this.state.selectedChat && (
                      <div className="support-messages-header">
                        <h4>
                          Name:{' '}
                          {`${_.get(
                            this.state.selectedChat,
                            'first_name',
                          )} ${_.get(
                            this.state.selectedChat,
                            'last_name',
                            '',
                          )}`}
                        </h4>
                        <p>
                          Contact:{' '}
                          {this.state.selectedChat.formatted_mobile_number}
                        </p>
                      </div>
                    )}

                    {this.state.newChat && (
                      <div className="support-messages-header">
                        <h4>
                          Name: {_.get(this.state.newChat, 'full_name', '')}
                        </h4>
                        <p>
                          Contact:{' '}
                          {this.state.newChat.formatted_mobile_number
                            ? _.get(
                                this.state.newChat,
                                'formatted_mobile_number',
                                '',
                              )
                            : ''}
                        </p>
                      </div>
                    )}

                    <div id="messagesDiv" className="support-messages-content">
                      {this.state.messages.length
                        ? this.state.messages.map((message, index) => {
                          if (message.type === 'user')
                            return (
                              <div
                                className="message-item message-item--left"
                                key={index}
                              >
                                <div className="message-item-wrapper">
                                  <div className="message-item-header">
                                    <span className="message-title">
                                      {`${_.get(
                                          this.state.selectedChat,
                                          'first_name',
                                          ''
                                        )
                                          } ${
                                          _.get(
                                            this.state.selectedChat,
                                            'last_name',
                                            ''
                                          )}`}
                                    </span>
                                  </div>
                                  <div className="message-item-content">
                                    <p>{message.message}</p>
                                  </div>
                                  <div className="message-item-footer">
                                    <p>{message.createdAt}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          return (
                            <div
                              className='message-item message-item--right'
                                key={index}
                              >
                              <div className='message-item-wrapper'>
                                <div className='message-item-header'>
                                  <span className='message-title'>You</span>
                                  </div>
                                <div className='message-item-content word-break'>
                                    <p>{message.message}</p>
                                </div>
                                <div className='message-item-footer'>
                                  <p>{message.createdAt}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                        : null}
                    </div>

                    <div className="support-messages-footer position-relative">
                      <Form.Group controlId="supportMessage">
                        <Form.Control
                          rows="2"
                          as="textarea"
                          maxLength={5000}
                          placeholder="Type your message and press enter..."
                          onChange={e => this.setTextMessage(e)}
                          onKeyDown={e => this.onKeyFormSubmission(e)}
                          value={this.state.text}
                        />
                      </Form.Group>

                      <Button
                        type="button"
                        className="btn btn-secondary btn-search d-flex align-items-center justify-content-center"
                        onClick={() =>
                          this.sendMessage(!this.state.selectedChat)
                        }
                        disabled={!this.state.isSendEnabled}
                      >
                        Send <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                    </div>
                  </React.Fragment>
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
    this.pusherSend.disconnect();
    if (this.pusherReceive) {
      this.pusherReceive.disconnect();
    }
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = {
  getChats,
  getMessages,
  sendMessages,
  updateUnreadCount,
  getChatsUsers,
};

export default hasPermission(
  requireAuth(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(SupportPage),
  ),
);
