import React from 'react';
import { Link } from 'react-router-dom';
import { map, filter, includes, trim } from 'lodash';
import { Menu } from 'antd';
const { SubMenu } = Menu;

function renderMenu(
  libMenu,
  subItemsList,
  subItemsList1,
  openMenu,
  setOpenMenu,
) {
  console.log(openMenu);
  const hasSubMenu = (item1, item2) => {
    const parentClans = map(
      item2,
      data2 => data2.directLibraryParent_html.fields.title,
    );
    const mappedItems = map(item1, data => ({
      ...data,
      hasSubMenu: includes(parentClans, data.title),
    }));

    return mappedItems;
  };

  function getRenderSubItems2(title1) {
    const itemsOfSubMenu = filter(
      subItemsList1,
      item => item.directLibraryParent_html.fields.title === title1,
    );
    return (
      <Menu key={title1} openKeys={['The Auctoritas Ritae (Sabbat)']}>
        {map(hasSubMenu(itemsOfSubMenu, subItemsList1), item => (
          <SubMenu
            key={item.title}
            expandIcon={
              item.hasSubMenu ? (
                <i className="ant-menu-submenu-arrow" />
              ) : (
                <span />
              )
            }
          >
            <Link
              to={`/vampire/Library/${item.title}`}
              value={item.title}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ color: '#1890ff' }}
            >
              {item.title}
            </Link>
          </SubMenu>
        ))}
      </Menu>
    );
  }

  function getRenderSubItems(title1) {
    const itemsOfSubMenu = filter(
      subItemsList,
      item => item.directLibraryParent_html.fields.title === title1,
    );

    return (
      <Menu key={title1}>
        {map(hasSubMenu(itemsOfSubMenu, subItemsList1), item => (
          <SubMenu
            style={{ paddingLeft: 0 }}
            key={item.title}
            expandIcon={
              item.hasSubMenu ? (
                <i className="ant-menu-submenu-arrow" />
              ) : (
                <span />
              )
            }
            title={
              <Link
                to={`/vampire/Library/${item.title}`}
                value={item.title}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {item.title}
              </Link>
            }
          >
            {getRenderSubItems2(item.title)}
          </SubMenu>
        ))}
      </Menu>
    );
  }

  return (
    <Menu
      mode="inline"
      openKeys={['The Auctoritas Ritae (Sabbat)', 'Sabbat']}
      multiple
    >
      {map(libMenu, item => (
        <SubMenu
          key={item.title}
          expandIcon={
            item.hasSubMenu ? (
              <i className="ant-menu-submenu-arrow" />
            ) : (
              <span />
            )
          }
          title={
            <Link
              to={`/vampire/Library/${item.title}`}
              value={item.title}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setOpenMenu(item.title);
              }}
            >
              {item.title}
            </Link>
          }
        >
          {getRenderSubItems(item.title)}
        </SubMenu>
      ))}
    </Menu>
  );
}

export default renderMenu;
