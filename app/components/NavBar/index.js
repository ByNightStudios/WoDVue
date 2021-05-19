/* eslint-disable no-param-reassign */
/**
 *
 * NavBar
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import { Menu, Dropdown, Button, Checkbox, Tooltip } from 'antd';
import { map, find, isEmpty, includes, compact, filter } from 'lodash';
import history from 'utils/history';
import './style.css';

function NavBar({
  OnRequestDropDownItems,
  data,
  handleSelectedItems,
  match,
  OnRequestDisciplines,
  tech,
  setTechData,
}) {
  const [filterData, setFilterData] = useState([]);
  const { orderByData1, orderByData2, orderByData3 } = tech;

  function renderText(item) {
    const filterItem1 = filter(orderByData3, { power: item });
    const filterItem2 = filter(
      filterItem1,
      itemData => itemData.title !== item,
    );
    return map(filterItem2, (item1, index) => (
      <div
        key={index}
        style={{
          margin: 10,
          padding: 10,
          border: '1px solid #fff',
          borderRadius: '12px',
        }}
      >
        <Checkbox
          onChange={onChange}
          style={{ color: '#fff' }}
          value={item1.title}
        >
          {item1.title}
        </Checkbox>
      </div>
    ));
  }

  function getfilteredItem(item, data1) {
    const itemPrere = item.prerequisites.map(item1 => item1.split(' ')[0]);
    for (let i = 0; i <= data1.length; i += 1) {
      if (includes(itemPrere, data1[i])) {
        return item;
      }
    }
    return null;
  }
  useEffect(() => {
    if (orderByData2) {
      const filterOrderByData = orderByData2.map(item =>
        getfilteredItem(item, filterData),
      );
      const nullValue = filterOrderByData.filter(val => val !== null);
      setTechData(nullValue);
    }
  }, [filterData]);

  const navItems = () => {
    const navEnv =
      'Clans & Bloodlines|clans,Disciplines|discipline,Techniques|techniques,Skills|skills,Merits|merits,Flaws|flaws,Attributes|attributes,Backgrounds|backgrounds';
    return navEnv
      .split(',')
      .map(ni => ni.split('|'))
      .map(a => ({ text: a[0], contentTypeId: a[1] }));
  };

  function handleOnMouseUp(navItem) {
    if (navItem === 'techniques') {
      OnRequestDisciplines();
    } else {
      OnRequestDropDownItems(navItem);
    }
    setFilterData([]);
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

  function handleSelectedItem(id, text) {
    const selectedItemData = find(data, { id });
    const link = `${match.path}/${
      window.location.pathname.split('/')[4]
    }/${text.replace(new RegExp(' ', 'g'), '_')}`;
    window.open(link, '_blank');
    delete selectedItemData.items;
    handleSelectedItems(selectedItemData);
  }

  function getText(text) {
    if (text === 'Clans & Bloodlines') {
      return 'clan';
    }
    return text;
  }

  function onChange(event) {
    const {
      target: { value },
    } = event;
    if (!filterData.includes(value)) {
      setFilterData([...filterData, value]);
    } else {
      setFilterData(filterData.filter(item => item !== value));
    }
  }

  function renderDisciplineFilter() {
    const path = window.location.pathname.includes('Techniques');
    if (orderByData1 && path) {
      const filterOrderByData1 = compact(
        map(orderByData1, item =>
          item.necromancy || item.thaumaturgy ? null : item,
        ),
      );
      return map(filterOrderByData1, (item, index) => (
        <Tooltip title={renderText(item.title)} style={{ zIndex: 12 }}>
          <div
            key={index}
            style={{
              margin: 10,
              padding: 10,
              border: '1px solid #fff',
              borderRadius: '12px',
            }}
          >
            <Checkbox
              onChange={onChange}
              style={{ color: '#fff' }}
              value={item.title}
            >
              {item.title}
            </Checkbox>
          </div>
        </Tooltip>
      ));
    }
    return null;
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
            onClick={() => handleSelectedItem(id, text)}
            style={{ color: '#fff' }}
          >
            <Tooltip title={renderText(text)}>{text}</Tooltip>
          </Menu.Item>
        ))}
      </Menu>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Element
        name="scroll-container-second-element"
        id="scroll-container-second-element"
      >
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
                  history.push(`/vampire/${getText(text)}`);
                  handleOnMouseUp(contentTypeId);
                }}
                onMouseLeave={handleOnMouseLeave}
              >
                {text}
              </Button>
            </Dropdown>
          ))}
        </nav>
      </Element>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: '#000000',
          paddingRight: '10vw',
          paddingLeft: '10vw',
        }}
      >
        {renderDisciplineFilter()}
      </div>
    </div>
  );
}

NavBar.propTypes = {
  OnRequestDropDownItems: PropTypes.func,
  match: PropTypes.object,
  data: PropTypes.array,
  handleSelectedItems: PropTypes.func,
  ...NavBar,
};

export default NavBar;
