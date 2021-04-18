import { PlusOutlined } from '@ant-design/icons';
import { Modal, Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { RoleItem } from '@/models/sys/Role';
import { createRole, readRole, updateRole, deleteRole } from '@/services/sys/Role';

const { confirm } = Modal;

const handleCreate = async (fields: RoleItem) => {
  const hide = message.loading('正在添加');
  try {
    await createRole({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleUpdate = async (fields: RoleItem) => {
  const hide = message.loading('正在添加');
  try {
    await updateRole({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleDelete = async (fields: RoleItem) => {
  confirm({
    title: '是否删除?',
    icon: <ExclamationCircleOutlined />,
    content: '是否删除',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      deleteRole({ ...fields });
      message.success('删除成功');
    },
    onCancel() {
    },
  });
};

const TableList: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<RoleItem>();
  const [selectedRowsState, setSelectedRows] = useState<RoleItem[]>([]);

      /** 国际化配置 */
  const intl = useIntl();

  const columns: ProColumns<RoleItem>[] = [
        {
            title: (
                <FormattedMessage
                id="pages.sys.role.table.roleName"
                defaultMessage="角色名称"
                />
            ),
            dataIndex: 'roleName',
            render: (dom, entity) => {
              return (
                <a
                  onClick={() => {
                    setCurrentRow(entity);
                    setShowDetail(true);
                  }}
                >
                  {dom}
                </a>
              );
            },
        },
    ];
    return (
    <PageContainer>
        <ProTable<RoleItem>
            actionRef={actionRef}
            toolBarRender={() => [
                <Button
                  type="primary"
                  key="primary"
                  onClick={() => {
                    handleCreateModalVisible(true);
                  }}
                >
                  <FormattedMessage id="pages.sys.role.createButton" defaultMessage="新建" />
                </Button>,
                <Button
                type="primary"
                key="primary"
                onClick={() => {
                  handleUpdateModalVisible(true);
                }}
              >
                <FormattedMessage id="pages.sys.role.updateButton" defaultMessage="修改" />
              </Button>,
              <Button
              type="primary"
              key="primary"
              onClick={async () => {
                await handleDelete(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <FormattedMessage id="pages.sys.role.deleteButton" defaultMessage="删除" />
            </Button>,
            ]}
            request={(params, sorter, filter) => readRole({ ...params, sorter, filter })}
            rowKey="id"
            columns={columns}
            rowSelection={{
                onChange: (_, selectedRows) => {
                  setSelectedRows(selectedRows);
                },
            }}
        />
        <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.roleName && (
          <ProDescriptions<RoleItem>
            column={2}
            title={currentRow?.roleName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.roleName,
            }}
            columns={columns as ProDescriptionsItemProps<RoleItem>[]}
          />
        )}
        </Drawer>
        <ModalForm
            title={intl.formatMessage({
            id: 'pages.sys.role.createForm.title',
            defaultMessage: '新建角色',
            })}
            width="400px"
            visible={createModalVisible}
            onVisibleChange={handleCreateModalVisible}
            onFinish={async (value) => {
              const success = await handleCreate(value as RoleItem);
              if (success) {
                  handleCreateModalVisible(false);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
              }
            }}
        >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.sys.role.createForm.roleName.message"
                  defaultMessage="角色名称为必填项"
                />
              ),
            },
          ]}
          width="md"
          name="roleName"
          label={
            <FormattedMessage
                id="pages.sys.role.createForm.roleName"
                defaultMessage="角色名称"
            />
          }
        />
      </ModalForm>
      <ModalForm
            modalProps={currentRow || {}}
            title={intl.formatMessage({
            id: 'pages.sys.role.updateForm.title',
            defaultMessage: '修改角色',
            })}
            width="400px"
            visible={updateModalVisible}
            onVisibleChange={handleUpdateModalVisible}
            onFinish={async (value) => {
              const success = await handleUpdate(value as RoleItem);
              if (success) {
                handleUpdateModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
        >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.sys.role.updateForm.roleName.message"
                  defaultMessage="角色名称为必填项"
                />
              ),
            },
          ]}
          width="md"
          name="roleName"
          label={
            <FormattedMessage
                id="pages.sys.role.updateForm.roleName"
                defaultMessage="角色名称"
            />
          }
        />
      </ModalForm>
    </PageContainer>
    );
};

export default TableList;