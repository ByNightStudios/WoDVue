import React from 'react';
import { Empty } from 'antd';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

import styles from './zoho-tabular.scss';

class ZohoTabular extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { elderData } = this.props;

    return (
      <div className='elder-zoho' style={styles}>
        <h4>Zoho Records Data</h4>

        {elderData && elderData.zoho_object ? (
          <Table
            bordered
            style={{
              display: 'block',
              height: '300px',
              overflowY: 'scroll',
            }}
          >
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Field</th>
                <th style={{ width: '60%' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(elderData.zoho_object).map((key, index) => {
                if (!key.startsWith('$')) {
                  return (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{JSON.stringify(elderData.zoho_object[key])}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        ) : (
          <div className='data-empty d-flex align-items-center justify-content-center'>
            <Empty />
          </div>
        )}
      </div>
    );
  }

  componentWillUnmount() {}
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  elderData: state.elder.elderData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ZohoTabular);
