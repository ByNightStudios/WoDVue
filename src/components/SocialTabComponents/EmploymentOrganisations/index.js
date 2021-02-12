/**
 *
 * EducationalQualification
 *
 */

import React, {
  memo,
  useState,
  useRef,
  createContext,
  useContext,
  useEffect
} from 'react';
import { Button, Table, Modal, Form, Input, Skeleton } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import './styles.scss';
import EmploymentOrgForm from './EmploymentOrgForm';

const EditableContext = createContext(null);

const showModal = setModalVisibility => setModalVisibility(true);
const handleOk = setModalVisibility => setModalVisibility(false);
const handleCancel = setModalVisibility => setModalVisibility(false);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

const handleSave = (row, setDataSource) => {
  setDataSource(prevState => {
    const newData = [...prevState];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    return newData;
  });
};
function EmploymentOrganisations(props) {
  const [isModalVisible, setModalVisibility] = useState(false);

  const {
    isNotErmOrErmSupervisor,
    isEmploymentUpdating,
    employments,
    isLoading,
    employmentFormSubmit
  } = props;

  const columns = useRef([{
    title: 'Organization',
    dataIndex: 'organization',
    editable: false
  }, {
    title: 'Designation',
    dataIndex: 'designation',
    editable: false
  }, {
    title: 'Year',
    dataIndex: 'year',
    width: 200,
    editable: false
  }]);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const tableColumns = columns.current.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (row) => handleSave(row, setDataSource),
      }),
    };
  });

  return (
    <>
      {
        isLoading ? <Skeleton active /> : (
          <>
            <Button
              disabled={isNotErmOrErmSupervisor}
              onClick={() => showModal(setModalVisibility)}
              type="primary"
              style={{
                marginBottom: 16,
              }}
              icon={<PlusCircleFilled />}
            >
              Add Employment Organization
          </Button>

            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={employments}
              columns={tableColumns}
              pagination={false}
              scroll={{ y: 250, x: 800 }}
            />

            <Modal
              title="Add Employment Organization"
              visible={isModalVisible}
              onOk={() => handleOk(setModalVisibility)}
              onCancel={() => handleCancel(setModalVisibility)}
              footer={false}
              destroyOnClose
              centered
            >
              <EmploymentOrgForm
                isEmploymentUpdating={isEmploymentUpdating}
                employmentFormSubmit={values => employmentFormSubmit(values, setModalVisibility)}
              />
            </Modal>
          </>
        )
      }
    </>
  );
}

EmploymentOrganisations.propTypes = {};

export default memo(EmploymentOrganisations);
