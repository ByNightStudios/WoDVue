import React from 'react';

import { Dropdown } from 'react-bootstrap';

import Header from '../components/Header';
// import {logout} from '../actions/userActions'
import { persistor } from '../store/store';

export const getRenderingHeader = props => {
  const logoutHandler = e => {
    e.preventDefault();
    // logout();
    persistor.purge();
    window.location.href = '/log-in';
  };

  const rightChildren = [
    <div className="profile-dropdown" key={0}>
      <Dropdown>
        <Dropdown.Toggle id="profileDropdown">
          <span className="profile-dropdown-photo d-inline-block" />
          <span className="profile-dropdown-content d-inline-block">
            {props ? props.full_name : 'Admin'}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={e => logoutHandler(e)}>
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>,
  ];

  return <Header rightChildren={rightChildren} />;
};
