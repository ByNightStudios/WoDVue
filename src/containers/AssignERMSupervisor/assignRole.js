import React, { useEffect, useState } from 'react';
import {
  Card,
  Select,
  Typography,
  Divider,
  Row,
  Col,
  Button,
  Space,
  message,
  Table,
  Tag,
} from 'antd';
import { Link } from 'react-router-dom';
import { map, isEmpty, get } from 'lodash';
import AdminService from '../../service/AdminService';
import { ROUTES } from '../../common/constants';

const adminServiceManager = new AdminService();

const { Option } = Select;
const { Title, Text } = Typography;

function AssignRole(props) {
  const [ermloading, setERMLoading] = useState(false);
  const [supervisorLoading, setSuperVisorLoading] = useState(false);
  const [ermList, setErmList] = useState([]);
  const [supervisorList, setSuperVisorList] = useState([]);
  const [selectedErm, setSelectedErm] = useState([]);
  const [selectedErmSupervisor, setSelectedErmSupervisor] = useState('');

  useEffect(() => {
    setERMLoading(true);
    setSuperVisorLoading(true);
    adminServiceManager.getAdminsByRole({ role: 'erm' }).then(res => {
      if (res) {
        setErmList(res.data);
        setERMLoading(false);
      }
    });
    adminServiceManager
      .getAdminsByRole({ role: 'erm supervisor' })
      .then(res => {
        if (res) {
          setSuperVisorList(res.data);
          setSuperVisorLoading(false);
        }
      });
  }, []);

  function handleChangeERM(value) {
    setSelectedErm(value);
  }

  function handleChangeERMSupervisor(value) {
    setSelectedErmSupervisor(value);
  }

  function handleAssignErm() {
    const payload = {
      user_data: selectedErm,
      manager_id: selectedErmSupervisor,
      user_role: 'erm',
      manager_role: 'erm supervisor',
    };

    adminServiceManager.adminAssignErmSupervisorRoles(payload).then(res => {
      if (res.data) {
        setSelectedErmSupervisor('');
        setSelectedErm([]);
        setTimeout(()=> {
          adminServiceManager.getAdminsByRole({ role: 'erm' }).then(res => {
            if (res) {
              setErmList(res.data);
              setERMLoading(false);
              message.success('Erm assigned successfully');
            }
          });
        }, 100);
      }
    });
  }

  const columns = [
    {
      title: 'Supervisor Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'View ERM',
      dataIndex: 'id',
      key: 'id',
      render: text => (
        <Link to={`${ROUTES.ELDERS_DASHBOARD}/${text}`}>View</Link>
      ),
    },
  ];

  function renderSupervisorName(item) {
    if (!isEmpty(item.superviser)) {
      return (
        <Tag color="red">{`${item.full_name},${
          item.superviser[0].first_name
        }(Un-assigned its supervisor first)`}</Tag>
      );
    }
    return item.full_name;
  }

  return (
    <div>
      {props.isEdit ? (
        <Card>
          <Title level={4}>Assign ERM Supervisor</Title>
          <Divider />
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row type="flex" align="middle" justify="space-between">
              <Col span={12}>
                <Text style={{ width: '100%' }}>Select ERM</Text>
                <Select
                  style={{ width: '90%' }}
                  mode="multiple"
                  value={selectedErm}
                  allowClear
                  placeholder="Please select"
                  onChange={handleChangeERM}
                  loading={ermloading}
                  disabled={isEmpty(ermList)}
                >
                  {map(ermList, item => (
                    <Option
                      key={item.id}
                      value={item.id}
                      disabled={!isEmpty(item.superviser)}
                    >
                      {renderSupervisorName(item)}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Text style={{ width: '100%' }}>Select Supervisor</Text>
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  value={selectedErmSupervisor}
                  placeholder="Please select"
                  onChange={handleChangeERMSupervisor}
                  loading={supervisorLoading}
                  disabled={isEmpty(supervisorList)}
                >
                  {map(supervisorList, ({ id, full_name: fullName }) => (
                    <Option key={id} value={id}>
                      {fullName}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Button
              type="primary"
              onClick={handleAssignErm}
              disabled={isEmpty(selectedErm) || isEmpty(selectedErmSupervisor)}
            >
              Assign ERM Supervisor
            </Button>

            <Title level={4}>Assign ERM Supervisor Listing</Title>
            <Divider />
            <Table
              columns={columns}
              dataSource={supervisorList}
              loading={supervisorLoading}
              bordered
            />
          </Space>
        </Card>
      ) : (
        <div />
      )}
    </div>
  );
}

export default AssignRole;
