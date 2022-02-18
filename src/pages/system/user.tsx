import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Button, Table, Tag, Modal, Row, Col, Checkbox } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormInstance
} from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useUserQueryData } from 'hooks/useUser'
import useRoleList from 'hooks/useRoleList'
import services from 'services'

const User: React.FC = () => {
  const formRef = useRef<ProFormInstance>()

  const [modalFormVisible, setModalFormVisible] = useState(false)

  const [modalCheckboxVisible, setModalCheckboxVisible] = useState(false)

  const [rowId, setRowId] = useState<number | string | undefined>(undefined)

  const [checkedIds, setCheckedIds] = useState<number[]>([])

  const queryClient = useQueryClient()

  const { loading, data, refresh } = useRequest(services.user.getUserList)

  const { options } = useRoleList()

  const user = useUserQueryData()

  const { mutate } = useMutation(services.user.userAuth, {
    onSuccess() {
      setModalCheckboxVisible(false)
      user?.data?.id === rowId && queryClient.invalidateQueries('user')
      queryClient.invalidateQueries('menu.nav')
      refresh()
    }
  })

  useEffect(() => {
    if (rowId) {
      const user = data?.data.find(role => role.id === rowId)
      const roles = user?.roles
      const ids = options?.filter(o => roles?.includes(o.label as string)).map(o => o.value as number)
      if (ids) {
        setCheckedIds(ids)
      }
    }
  }, [rowId])

  return (
    <>
      <ModalForm
        className="modalForm"
        formRef={formRef}
        title="新增用户"
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
        onFinish={async values => {
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
        title="分配角色"
        visible={modalCheckboxVisible}
        onOk={() => {
          mutate({
            id: rowId,
            checkedIds
          })
        }}
        onCancel={() => {
          setModalCheckboxVisible(false)
        }}
        afterClose={() => {
          setRowId(undefined)
          setCheckedIds([])
        }}
      >
        <>
          <Row>
            <Col><h4 style={{ marginBottom: 10 }}>角色列表</h4></Col>
          </Row>
          <Row>
            <Col>
              <Checkbox.Group options={options} value={checkedIds} onChange={value => {
                setCheckedIds(value as number[])
              }} />
            </Col>
          </Row>
        </>
      </Modal>
      <Button onClick={() => {
        setModalFormVisible(true)
      }} style={{ marginBottom: 24 }}>
        <PlusOutlined />
        新增用户
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
            title: '用户名',
            dataIndex: 'username',
            align: 'center',
            width: 150
          },
          {
            title: '电话',
            dataIndex: 'phone',
            align: 'center',
            width: 150
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            align: 'center',
            width: 200
          },
          {
            title: '描述',
            dataIndex: 'desc',
            align: 'center',
            width: 320
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
                  <Button type="link" onClick={() => {
                    setRowId(record.id)
                    setModalCheckboxVisible(true)
                  }}>分配角色</Button>
                </>
              )
            }
          }
        ]}
      />
    </>
  )
}

export default User