/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Typography,
  message,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
  Space,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  FolderViewOutlined,
} from '@ant-design/icons';
import { get, capitalize, concat, map, toString } from 'lodash';
import EldersFriendsManager from './dataManager';
import RegistrationForm from './AddNewFriendForm';
import NotesForm from './AddNotes';
import ViewNotes from './viewNotes';
import { checkIsErmOrErmSuperVisor } from '../../utils/checkElderEditPermission';
import './style.css';

const EldersFriendsManagerInstance = new EldersFriendsManager();

message.config({
  top: 80,
  maxCount: 1,
});

const EditableTable = props => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const { currentElderIdentifier } = props;
    EldersFriendsManagerInstance.getElderFriendData(currentElderIdentifier)
      .then(res => {
        if (res) {
          const dataSource = map(get(res, 'data', []), (item, index) => {
            const mapObject = {
              key: toString(index),
              ...item,
            };
            return mapObject;
          });
          setData(dataSource);
        }
      })
      .catch(error => {
        message.error(error);
      });
  }, []);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [OpenModal, setOpenModal] = useState(false);
  const [friendRecord, setFriendRecord] = useState('');
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [openViewNotesModal, setViewNotesModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const onConfirm = () => {
    setChecked(true);
    setVisible(false);
  };

  const onCancel = () => {
    setChecked(false);
    setVisible(false);
  };

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const addElderNotes = record => {
    setOpenNotesModal(true);
    setFriendRecord(record);
  };

  const viewElderNotes = record => {
    setViewNotesModal(true);
    setFriendRecord(record);
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      const updatedRow = newData[key];
      const updatedRowData = {
        ...updatedRow,
        ...row,
      };

      const {
        city,
        country,
        empowerComplimentaryOffered,
        lat,
        lng,
        mobile_number,
        name,
        rsvp,
        state,
        street_address,
        uuid,
      } = updatedRowData;

      const updatedPayload = {
        city,
        country,
        empowerComplimentaryOffered: checked ? '1' : '0',
        lat,
        lng,
        mobile_number,
        name,
        rsvp: renderBooleanTextUpdated(rsvp),
        state,
        street_address,
      };

      EldersFriendsManagerInstance.updateElderFriendData(
        uuid,
        updatedPayload,
      ).catch(error => {
        message.error(error);
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
    const { currentElderIdentifier } = props;

    setTimeout(() => {
      EldersFriendsManagerInstance.getElderFriendData(currentElderIdentifier)
        .then(res => {
          if (res) {
            const dataSource = map(get(res, 'data', []), (item, index) => {
              const mapObject = {
                key: toString(index),
                ...item,
              };
              return mapObject;
            });
            setData(dataSource);
            message.success('Friend updated successfully');
          }
        })
        .catch(error => {
          message.error(error);
        });
    }, [1000]);
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      editable: true,
      render: text => (
        <Typography.Text mark strong>
          {capitalize(text)}
        </Typography.Text>
      ),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile_number',
      key: 'mobile_number',
      editable: true,
      width: 200,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'Empower Complimentary Registered (y/n)',
      dataIndex: 'empowerComplimentaryOffered',
      key: 'empowerComplimentaryOffered',
      width: 200,
      editable: true,
      render: text => (
        <Switch
          checked={text}
          disabled
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: 'Synced Status',
      dataIndex: 'is_sync_user',
      key: 'is_sync_user',
      width: 150,
      render: text => {
        if (text) {
          return <Tag color="green">SYNCED</Tag>;
        }
        return <Tag color="red">NOT SYNCED</Tag>;
      },
    },
    {
      title: 'Street Address',
      dataIndex: 'street_address',
      key: 'street_address',
      editable: true,
      width: 200,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 100,
      editable: true,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      editable: true,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 100,
      editable: true,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'Latitude',
      dataIndex: 'lat',
      key: 'lat',
      width: 100,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'Longitude',
      dataIndex: 'lng',
      key: 'lng',
      width: 100,
      render: text => {
        if (text) {
          return text;
        }
        return <Tag color="red">Not Filled</Tag>;
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        const editable = isEditing(record);
        return (
          <Space direction="horizontal">
            {editable ? (
              <span>
                <Tooltip title="save elder record">
                  <Button
                    onClick={() => save(record.key)}
                    style={{
                      marginRight: 8,
                    }}
                    icon={<SaveOutlined />}
                    disabled={checkIsErmOrErmSuperVisor(
                      props.user,
                      props.elderData,
                    )}
                  />
                </Tooltip>
                <Tooltip title="cancel elder record">
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <Button
                      icon={<CloseOutlined />}
                      disabled={checkIsErmOrErmSuperVisor(
                        props.user,
                        props.elderData,
                      )}
                    />
                  </Popconfirm>
                </Tooltip>
              </span>
            ) : (
              <Tooltip title="edit elder record">
                <Button
                  onClick={() => edit(record)}
                  icon={<EditOutlined />}
                  disabled={
                    record.empowerComplimentaryOffered ||
                    checkIsErmOrErmSuperVisor(props.user, props.elderData)
                  }
                />
              </Tooltip>
            )}
            <Tooltip title="Add Elder Notes">
              <Button
                onClick={() => addElderNotes(record)}
                icon={<PlusCircleOutlined />}
                disabled={
                  record.empowerComplimentaryOffered ||
                  checkIsErmOrErmSuperVisor(props.user, props.elderData)
                }
              />
            </Tooltip>
            <Tooltip title="View Elder Notes">
              <Button
                onClick={() => viewElderNotes(record)}
                icon={<FolderViewOutlined />}
                disabled={checkIsErmOrErmSuperVisor(
                  props.user,
                  props.elderData,
                )}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const renderBooleanTextUpdated = text => {
    if (
      text === 1 ||
      text === '1' ||
      text === true ||
      text === 'yes' ||
      text === 'Yes'
    ) {
      return '1';
    }
    return '0';
  };

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleUpdateState = newData => {
    const upDateddataSource = concat(newData, data);
    setData(upDateddataSource);
    const { currentElderIdentifier } = props;
    EldersFriendsManagerInstance.getElderFriendData(currentElderIdentifier)
      .then(res => {
        if (res) {
          const dataSource = map(get(res, 'data', []), (item, index) => {
            const mapObject = {
              key: toString(index),
              ...item,
            };
            return mapObject;
          });
          setData(dataSource);
        }
      })
      .catch(error => {
        message.error(error);
      });
  };

  function handleCancel() {
    setOpenModal(false);
  }

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleCancelNotesModal() {
    setOpenNotesModal(false);
    setFriendRecord('');
  }

  function handleCancelViewNotes() {
    setViewNotesModal(false);
    setFriendRecord('');
  }

  const renderSwitch = record => {
    if (record.empowerComplimentaryOffered) {
      return (
        <Switch
          checkedChildren="Yes"
          unCheckedChildren="No"
          checked={record.empowerComplimentaryOffered}
          disabled={record.empowerComplimentaryOffered}
        />
      );
    }
    return (
      <Popconfirm
        title="This action can not be undone. Are you sure you want to do it?"
        visible={visible}
        onConfirm={onConfirm}
        onCancel={onCancel}
        okText="Yes"
        cancelText="No"
      >
        <Switch
          onClick={() => setVisible(true)}
          checked={checked}
          disabled={checked}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      </Popconfirm>
    );
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      dataIndex === 'empowerComplimentaryOffered' ? (
        renderSwitch(record)
      ) : (
        <Input />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <Form form={form} component={false}>
      <Button
        onClick={handleOpenModal}
        style={{ marginBottom: 10 }}
        disabled={checkIsErmOrErmSuperVisor(props.user, props.elderData)}
      >
        Add New Friend
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        scroll={{ y: 300, x: '90vw' }}
      />
      <Modal
        title="Add elder`s friend"
        width="48%"
        visible={OpenModal}
        onCancel={handleCancel}
        footer={false}
        bodyStyle={{
          height: 400,
          overflow: 'auto',
        }}
        destroyOnClose
      >
        <RegistrationForm
          handleCancel={handleCancel}
          updateState={handleUpdateState}
          currentElderIdentifier={props.currentElderIdentifier}
        />
      </Modal>
      <Modal
        title="Add Notes"
        width="48%"
        visible={openNotesModal}
        onCancel={handleCancelNotesModal}
        footer={false}
        bodyStyle={{
          height: 250,
          overflow: 'auto',
        }}
        destroyOnClose
      >
        <NotesForm
          handleCancel={handleCancelNotesModal}
          friendRecord={friendRecord}
        />
      </Modal>
      <Modal
        title="View Notes"
        width="48%"
        visible={openViewNotesModal}
        onCancel={handleCancelViewNotes}
        footer={false}
        bodyStyle={{
          height: 400,
          overflow: 'auto',
        }}
        destroyOnClose
      >
        <ViewNotes
          handleCancel={handleCancelViewNotes}
          friendRecord={friendRecord}
        />
      </Modal>
    </Form>
  );
};

const FriendsTab = EditableTable;

export default FriendsTab;
