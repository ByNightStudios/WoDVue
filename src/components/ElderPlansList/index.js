import React from 'react';

import { tableColumns } from './dataManager';

import { connect } from 'react-redux';
import { Table } from 'antd';

class ElderPlansList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      tableOptions: {
        hasData: true,
        bordered: true,
        loading: false,
        size: 'default',
        showHeader: true,
      },
    };
  }

  render() {
    const { tableOptions } = this.state;
    const { plansList, elderData } = this.props;

    return (
      <div className='plans-tab-pastPlans'>
        <div className='plans-tab-header d-flex justify-content-between align-items-center'>
          <h4>Past Plans</h4>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Table
              rowKey={(record) => record.index}
              {...tableOptions}
              columns={tableColumns}
              dataSource={
                tableOptions.hasData && plansList.length ? plansList : null
              }
              pagination={{
                hideOnSinglePage: true,
                total: plansList.length,
              }}
              rowClassName={(record, index) => {
                switch (record.status) {
                  case 0:
                    return 'urgent-priority';
                  case 1:
                    return 'important-priority';
                  default:
                    return 'non-priority';
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  elderdata: state.elder.elderData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ElderPlansList);
