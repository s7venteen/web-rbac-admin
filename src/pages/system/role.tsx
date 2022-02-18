import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Button, Table, Tag, Modal, Tree, Row, Col, Spin } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormInstance
} from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import services from 'services'

const Role: React.FC = () => {
  const formRef = useRef<ProFormInstance>()

  const [modalFormVisible, setModalFormVisible] = useState(false)

  const [modalTreeVisible, setModalTreeVisible] = useState(false)

  const [rowId, setRowId] = useState(undefined)

  const [checkedKeys, setCheckedKeys] = useState<number[]>([])

  const queryClient = useQueryClient()

  const { loading, data, refresh } = useRequest(services.role.getRoleList)
  const authList = useRequest(services.auth.getAuthList, {
    ready: !!rowId
  })

  const { isLoading, mutate } = useMutation(services.role.roleAuth, {
    onSuccess() {
      setModalTreeVisible(false)
      queryClient.invalidateQueries('user')
      queryClient.invalidateQueries('menu.nav')
      refresh()
    }
  })

  return (
    <>
      <ModalForm
        className="modalForm"
        formRef={formRef}
        title="新增角色"
        layout={'horizontal'}
        width={600}
        visible={modalFormVisible}
        initialValues={{
          roleName: '',
          desc: '',
          order: undefined,
          status: 1
        }}
        modalProps={{
          afterClose() { }
        }}
        onVisibleChange={setModalFormVisible}
        onFinish={async () => {
          return true
        }}
        labelCol={{ span: 4 }}
      >
        <ProFormText
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText
          name="desc"
          label="描述"
          placeholder="请输入描述"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormDigit
          name="order"
          label="排序"
          placeholder="请输入排序"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请输入状态"
          rules={[{ required: true, message: '这是必填项' }]}
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 2 }
          ]}
        />
      </ModalForm>
      <Modal
        title="分配权限"
        visible={modalTreeVisible}
        confirmLoading={isLoading}
        onOk={() => {
          mutate({
            id: rowId,
            menuIds: checkedKeys
          })
        }}
        onCancel={() => {
          setModalTreeVisible(false)
        }}
        afterClose={() => {
          setRowId(undefined)
          setCheckedKeys([])
        }}
      >
        <Row>
          <Col><h4 style={{ marginBottom: 10 }}>权限列表</h4></Col>
          <Col>
            {(authList.loading || !authList.data) ? <Spin style={{ marginLeft: 15 }} size={'small'} /> : (
              <Tree
                checkable
                defaultExpandAll
                treeData={authList.data?.data}
                fieldNames={{ key: 'id', title: 'menuName' }}
                defaultCheckedKeys={checkedKeys}
                onCheck={(c, i) => {
                  setCheckedKeys(c as number[])
                }}
              />
            )}
          </Col>
        </Row>
      </Modal>
      <Button
        onClick={() => {
          setModalFormVisible(true)
        }}
        style={{ marginBottom: 24 }}
      >
        <PlusOutlined />
        新增角色
      </Button>
      <Table
        className="ui-table"
        rowKey={'id'}
        dataSource={data?.data}
        loading={loading}
        scroll={{ x: 1300 }}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            align: 'center'
          },
          {
            title: '角色名',
            dataIndex: 'roleName',
            align: 'center'
          },
          {
            title: '描述',
            dataIndex: 'desc',
            align: 'center',
            width: 500
          },
          {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            render(_, record, index) {
              return <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>
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
                  <Button
                    type="link"
                    onClick={() => {
                      setRowId(record.id)
                      console.log(record.menuIds)
                      setCheckedKeys(record.menuIds)
                      setModalTreeVisible(true)
                    }}
                  >
                    授权
                  </Button>
                </>
              )
            }
          }
        ]}
      />
    </>
  )
}

export default Role