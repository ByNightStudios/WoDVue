/**
 *
 * NavBar
 *
 */

import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import './style.css';
const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.taobao.com/"
      >
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

// getContentTypeIdsString: function getContentTypeIdsString() {
//   const envVarKey = `VUE_APP_CONTENT_TYPE_NAV_ITEMS_${this.curMonster.toUpperCase()}`;
//   const envVar = process.env[envVarKey];
//   return envVar;
// },
// getContentTypeIds: function getContentTypeIds(monster) {
//   return this.processContentTypeIds(this.getContentTypeIdsString(monster));
// },
// processContentTypeIds: function processContentTypeIds(contentTypesString) {
//   return contentTypesString
//     .split(',')
//     .map((ni) => ni.split('|'))
//     .map((a) => ({ text: a[0], contentTypeId: a[1] }));
// },
// },
// mounted() {
// this.$store.commit('updateCurContentTypeId', this.$route.params.contentType);
// this.monsterContentTypeIds = this.getContentTypeIds(this.curMonster);
// },
// watch: {
// curMonster(newMonster) {
//   this.monsterContentTypeIds = this.getContentTypeIds(newMonster);
// },
// }

function handleOnMouseUp() {
  console.log('i am on hover');
}

function handleOnMouseLeave() {
  console.log('on mouse leave');
}
function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg" id="monsterContentTypesNav">
      <Dropdown
        overlay={menu}
        placement="bottomCenter"
        arrow
        className="antd-drop-down"
      >
        <Button
          onMouseEnter={handleOnMouseUp}
          onMouseLeave={handleOnMouseLeave}
        >
          topCenter
        </Button>
      </Dropdown>
    </nav>
  );
}

NavBar.propTypes = {};

export default NavBar;
