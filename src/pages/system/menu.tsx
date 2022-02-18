import React, { useRef, useState, useMemo } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Button, TreeSelect, Form, Table, Tag, Popconfirm, message, Spin } from 'antd'
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormInstance
} from '@ant-design/pro-form'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import services from 'services'
import type { BaseMenuItem } from 'services/menu'
import { buildTree } from 'utils/tree'
import './menu.less'

const Menu: React.FC = () => {
  const formRef = useRef<ProFormInstance>()

  const [menuId, setMenuId] = useState<BaseMenuItem['id'] | undefined>(undefined)

  const [modalVisit, setModalVisit] = useState(false)

  const { loading, data: menuSelect } = useRequest(services.menu.getMenuSelect, {
    ready: modalVisit
  })

  const menuList = useRequest(services.menu.getMenuList)

  const menu = useRequest(() => services.menu.getMenuById(menuId as BaseMenuItem['id']), {
    ready: !!menuId,
    refreshDeps: [menuId],
    onSuccess(res) {
      formRef.current?.setFieldsValue({
        menuName: res.data.menuName,
        url: res.data.url,
        perms: res.data.perms,
        parentId: res.data.parentId,
        menuType: res.data.menuType,
        menuVisible: res.data.menuVisible,
        menuStatus: res.data.menuStatus
      })
    }
  })

  const menuTree = useMemo(() => {
    if (menuSelect?.code === 200) {
      return buildTree('id', 'parentId', menuSelect.data)
    }
  }, [menuSelect?.data])

  const queryClient = useQueryClient()

  const createMenu = useMutation(services.menu.createMenu, {
    onSuccess() {
      refreshMenu()
    }
  })

  const updateMenu = useMutation(services.menu.updateMenu, {
    onSuccess() {
      refreshMenu()
    }
  })

  const deleteMenu = useMutation(services.menu.deleteMenu, {
    onSuccess() {
      refreshMenu()
    }
  })

  const refreshMenu = () => {
    queryClient.invalidateQueries('user')
    queryClient.invalidateQueries('menu.nav')
    menuList.refresh()
  }

  return (
    <>
      <ModalForm
        className="modalForm"
        formRef={formRef}
        title={menuId ? '编辑菜单' : '新增菜单'}
        layout={'horizontal'}
        width={600}
        visible={modalVisit}
        initialValues={{
          menuName: '',
          url: '',
          perms: '',
          parentId: 0,
          menuType: 1,
          menuVisible: 1,
          menuStatus: 1
        }}
        modalProps={{
          afterClose() {
            formRef.current?.resetFields()
            setMenuId(undefined)
          }
        }}
        onVisibleChange={setModalVisit}
        onFinish={async values => {
          if (menuId) {
            await updateMenu.mutateAsync({
              id: menuId,
              ...values
            })
            return true
          }
          await createMenu.mutateAsync(values)
          return true
        }}
      >
        <Spin spinning={menu.loading || loading}>
          {!loading && (
            <Form.Item name="parentId" label="上级菜单">
              <TreeSelect
                placeholder="请选择菜单"
                treeDefaultExpandAll
                treeData={menuTree}
                fieldNames={{
                  label: 'menuName',
                  value: 'id'
                }}
              />
            </Form.Item>
          )}
          <ProFormRadio.Group
            label="菜单类型"
            name="menuType"
            options={[
              { label: '目录', value: 1 },
              { label: '菜单', value: 2 }
            ]}
          />
          <ProFormText
            name="menuName"
            label="菜单名称"
            placeholder="请输入菜单名称"
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProFormText
            name="url"
            label="路由地址"
            placeholder="请输入路由地址"
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProForm.Group>
            <ProFormRadio.Group
              label="显示状态"
              name="menuVisible"
              options={[
                { label: '显示', value: 1 },
                { label: '隐藏', value: 2 },
              ]}
            />
            <ProFormRadio.Group
              label="菜单状态"
              name="menuStatus"
              options={[
                { label: '启用', value: 1 },
                { label: '停用', value: 2 },
              ]}
            />
          </ProForm.Group>
        </Spin>
      </ModalForm>
      <Button onClick={() => {
        setModalVisit(true)
      }} style={{ marginBottom: 24 }}>
        <PlusOutlined />
        新增菜单
      </Button>
      <Table
        className="ui-table"
        rowKey={'id'}
        dataSource={menuList.data?.data}
        loading={menuList.loading}
        scroll={{ x: 1300 }}
        columns={[
          {
            title: '上级菜单',
            dataIndex: 'parentName',
            align: 'center'
          },
          {
            title: '名称',
            dataIndex: 'menuName',
            align: 'center'
          },
          {
            title: '菜单URL',
            dataIndex: 'url',
            align: 'center'
          },
          {
            title: '类型',
            dataIndex: 'menuType',
            align: 'center',
            render(_, record, index) {
              const tagMap = new Map([
                [1, <Tag color={'processing'}>目录</Tag>],
                [2, <Tag color={'magenta'}>菜单</Tag>]
              ])
              return tagMap.get(record.menuType)
            }
          },
          {
            title: '状态',
            dataIndex: 'menuStatus',
            align: 'center',
            render(_, record, index) {
              const tagMap = new Map([
                [1, <Tag color={'green'}>启用</Tag>],
                [2, <Tag color={'red'}>禁用</Tag>]
              ])
              return tagMap.get(record.menuStatus)
            }
          },
          {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 220,
            render(_, record, index) {
              return (
                <>
                  <Button type="link" onClick={() => {
                    setModalVisit(true)
                    // setDefaultTreeDataItem({
                    //   id: record.id,
                    //   menuName: record.menuName
                    // })
                    formRef.current?.setFieldsValue({
                      parentId: record.id,
                      menuType: 2
                    })
                  }}>新增</Button>
                  <Button type="link" onClick={() => {
                    setModalVisit(true)
                    setMenuId(record.id)
                  }}>修改</Button>
                  <Popconfirm
                    title="确定要删除?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => {
                      if (record.children) {
                        message.error('请先删除子菜单')
                      } else {
                        return deleteMenu.mutateAsync(record.id)
                      }
                    }}
                  >
                    <Button type="link">删除</Button>
                  </Popconfirm>
                </>
              )
            }
          }
        ]}
      />
    </>
  )
}

export default Menu