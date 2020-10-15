/**
 *
 * NavBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button } from 'antd';
import { map, find, isEmpty } from 'lodash';
import history from 'utils/history';
import './style.css';

function NavBar({ OnRequestDropDownItems, data, handleSelectedItems, match }) {
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

  function handleOnMouseLeave() {}

  function getItemText(item) {
    if (item.title) {
      return item.title;
    }
    if (item.merit) {
      return item.merit;
    }
    if (item.flaw) {
      return item.flaw;
    }

    if (item.technique) {
      return item.technique;
    }

    if (item.attribute) {
      return item.attribute;
    }

    return 'GOT NOTHING';
  }
  function getItemContent(item) {
    const dataItem = {
      id: item.id,
      text: getItemText(item),
      isClickable: isEmpty(item.items),
    };

    return dataItem;
  }

  function handleSelectedItem(id) {
    const selectedItemData = find(data, { id });
    history.push(
      `${match.path}/${window.location.pathname.split('/')[4]}/${id}`,
    );
    delete selectedItemData.items;
    handleSelectedItems(selectedItemData);
  }

  function getText(text) {
    if (text === 'Clans & Bloodlines') {
      return 'clan';
    }
    return text;
  }

  function handleOverlayMenu() {
    const dropDownContent = map(data, item => getItemContent(item));
    return (
      <Menu
        className="d-flex flex-column dropdownMenu"
        style={{
          backgroundColor: '#000000',
          maxHeight: '500px',
          overflow: 'auto',
        }}
      >
        {map(dropDownContent, ({ id, text }) => (
          <Menu.Item
            key={id}
            onClick={() => handleSelectedItem(id)}
            style={{ color: '#fff' }}
          >
            {text}
          </Menu.Item>
        ))}
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
          opened
        >
          <Button
            onMouseEnter={() => {
              history.push(`/WoDVue/monsters/vampire/${getText(text)}`);
              handleOnMouseUp(contentTypeId);
            }}
            onMouseLeave={handleOnMouseLeave}
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
  match: PropTypes.object,
  data: PropTypes.array,
  handleSelectedItems: PropTypes.func,
};

export default NavBar;
