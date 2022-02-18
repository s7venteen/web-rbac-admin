import React, { useRef, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { Button, Table, Form, TreeSelect, Tag } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormCheckbox,
  ProFormInstance
} from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import services from 'services'
import { buildTree } from 'utils/tree'
import useRoleList from 'hooks/useRoleList'

const Permission: React.FC = () => {
  const formRef = useRef<ProFormInstance>()

  const [modalVisit, setModalVisit] = useState(false)

  const { loading, data: permissionList, refresh } = useRequest(services.permission.getPermissionList)

  const { data: authList } = useRequest(services.auth.getAuthList, {
    ready: modalVisit
  })

  const createPermission = useMutation(services.permission.createPermission, {
    onSuccess() {
      refresh()
    }
  })

  const { options } = useRoleList()

  const authTree = useMemo(() => {
    if (authList?.code === 200) {
      return buildTree('id', 'parentId', authList.data)
    }
  }, [authList?.data])

  return (
    <>
      <ModalForm
        className="modalForm"
        formRef={formRef}
        title={'新增权限'}
        layout={'horizontal'}
        width={600}
        visible={modalVisit}
        initialValues={{
          menuId: undefined,
          permissionName: '',
          permission: '',
          status: 1
        }}
        modalProps={{
          afterClose() { }
        }}
        onVisibleChange={setModalVisit}
        onFinish={async values => {
          await createPermission.mutateAsync(values)
          return true
        }}
        labelCol={{ span: 4 }}
      >
        <Form.Item name="menuId" label="所属菜单" rules={[{ required: true, message: '这是必填项' }]}>
          <TreeSelect
            placeholder="请选择菜单"
            treeDefaultExpandAll
            treeData={authTree}
            fieldNames={{
              label: 'menuName',
              value: 'id'
            }}
          >
          </TreeSelect>
        </Form.Item>
        <ProFormText
          name="permissionName"
          label="权限名称"
          placeholder="请输入权限名称"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText
          name="permission"
          label="权限标识"
          placeholder="请输入权限标识"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请输入状态"
          rules={[{ required: true, message: '这是必填项' }]}
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 2 },
          ]}
        />
        <ProFormCheckbox.Group
          name="roleIds"
          label="角色"
          options={options}
          rules={[{ required: true, message: '这是必填项' }]}
        />
      </ModalForm>
      <Button onClick={() => {
        setModalVisit(true)
      }} style={{ marginBottom: 24 }}>
        <PlusOutlined />
        新增权限
      </Button>
      <Table
        className="ui-table"
        rowKey={'id'}
        dataSource={permissionList?.data}
        loading={loading}
        scroll={{ x: 1300 }}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            align: 'center'
          },
          {
            title: '所属菜单',
            dataIndex: 'menuName',
            align: 'center'
          },
          {
            title: '权限名称',
            dataIndex: 'permissionName',
            align: 'center'
          },
          {
            title: '权限标识',
            dataIndex: 'permission',
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            render(_, record, index) {
              const tagMap = new Map([
                [1, <Tag color={'green'}>启用</Tag>],
                [2, <Tag color={'red'}>禁用</Tag>]
              ])
              return tagMap.get(record.status)
            }
          },
          {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 300,
            render(_, record, index) {
              return (
                <>
                  <Button type="link">查看</Button>
                  <Button type="link">修改</Button>
                  <Button type="link">删除</Button>
                </>
              )
            }
          }
        ]}
      />
    </>
  )
}

export default Permission