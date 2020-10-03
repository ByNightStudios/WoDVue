/**
 *
 * NavBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button, Skeleton } from 'antd';
import { map } from 'lodash';
import './style.css';

const menu = (
  <Menu>
    <Menu.Item>
      <Skeleton />
    </Menu.Item>
    <Menu.Item>
      <Skeleton />
    </Menu.Item>
    <Menu.Item>
      <Skeleton />
    </Menu.Item>
  </Menu>
);

function NavBar({ OnRequestDropDownItems, loading, data }) {
  const navItems = () => {
    const navEnv =
      'Clans & Bloodlines|clans,Disciplines|discipline,Techniques|techniques,Skills|skills,Merits|merits,Flaws|flaws,Attributes|attributes,Backgrounds|backgrounds';
    return navEnv
      .split(',')
      .map(ni => ni.split('|'))
      .map(a => ({ text: a[0], contentTypeId: a[1] }));
  };

  function handleOnMouseUp(navItem) {
    OnRequestDropDownItems(navItem);
  }

  function handleOnMouseLeave() {
    console.log('on mouse leave');
  }

  console.log(data);
  function handleOverlayMenu() {
    if (loading) {
      return menu;
    }
    return (
      <Menu>
        <Menu.Item>i am a data</Menu.Item>
      </Menu>
    );
  }
  return (
    <nav className="navbar navbar-expand-lg" id="monsterContentTypesNav">
      {map(navItems(), ({ text, contentTypeId }, index) => (
        <Dropdown
          overlay={handleOverlayMenu}
          placement="bottomCenter"
          arrow
          className="antd-drop-down"
          key={index}
        >
          <Button
            onMouseEnter={() => handleOnMouseUp(contentTypeId)}
            onMouseLeave={() => handleOnMouseLeave()}
          >
            {text}
          </Button>
        </Dropdown>
      ))}
    </nav>
  );
}

NavBar.propTypes = {
  OnRequestDropDownItems: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array,
};

export default NavBar;
