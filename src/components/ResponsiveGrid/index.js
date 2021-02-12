/**
 *
 * ResponsiveGrid
 *
 */

import React, { memo } from 'react';
import { Col, Card, Space } from 'antd';
function ResponsiveGrid(props) {
  const {
    gridConfig,
    title,
    children,
    direction,
    bordered
  } = props;

  return (
    <Col
      xs={gridConfig.xs}
      sm={gridConfig.sm}
      md={gridConfig.md}
      lg={gridConfig.lg}
      xl={gridConfig.xl}
    >
      <Card
        bordered={bordered}
        size='small'
        title={title}
        headStyle={{
          fontWeight: 'bold'
        }}
      >
        <Card.Meta
          description={
            <Space
              direction={direction}
              style={{ width: '100%' }}
            >
              {children}
            </Space>
          }
        />
      </Card>
    </Col>
  )
};

ResponsiveGrid.propTypes = {};

ResponsiveGrid.defaultProps = {
  bordered: true,
  title: null,
  gridConfig: {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 8,
    xl: 8
  }
};

export default memo(ResponsiveGrid);
