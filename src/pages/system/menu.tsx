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
        title={menuId ? '????????????' : '????????????'}
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
            <Form.Item name="parentId" label="????????????">
              <TreeSelect
                placeholder="???????????????"
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
            label="????????????"
            name="menuType"
            options={[
              { label: '??????', value: 1 },
              { label: '??????', value: 2 }
            ]}
          />
          <ProFormText
            name="menuName"
            label="????????????"
            placeholder="?????????????????????"
            rules={[{ required: true, message: '???????????????' }]}
          />
          <ProFormText
            name="url"
            label="????????????"
            placeholder="?????????????????????"
            rules={[{ required: true, message: '???????????????' }]}
          />
          <ProForm.Group>
            <ProFormRadio.Group
              label="????????????"
              name="menuVisible"
              options={[
                { label: '??????', value: 1 },
                { label: '??????', value: 2 },
              ]}
            />
            <ProFormRadio.Group
              label="????????????"
              name="menuStatus"
              options={[
                { label: '??????', value: 1 },
                { label: '??????', value: 2 },
              ]}
            />
          </ProForm.Group>
        </Spin>
      </ModalForm>
      <Button onClick={() => {
        setModalVisit(true)
      }} style={{ marginBottom: 24 }}>
        <PlusOutlined />
        ????????????
      </Button>
      <Table
        className="ui-table"
        rowKey={'id'}
        dataSource={menuList.data?.data}
        loading={menuList.loading}
        scroll={{ x: 1300 }}
        columns={[
          {
            title: '????????????',
            dataIndex: 'parentName',
            align: 'center'
          },
          {
            title: '??????',
            dataIndex: 'menuName',
            align: 'center'
          },
          {
            title: '??????URL',
            dataIndex: 'url',
            align: 'center'
          },
          {
            title: '??????',
            dataIndex: 'menuType',
            align: 'center',
            render(_, record, index) {
              const tagMap = new Map([
                [1, <Tag color={'processing'}>??????</Tag>],
                [2, <Tag color={'magenta'}>??????</Tag>]
              ])
              return tagMap.get(record.menuType)
            }
          },
          {
            title: '??????',
            dataIndex: 'menuStatus',
            align: 'center',
            render(_, record, index) {
              const tagMap = new Map([
                [1, <Tag color={'green'}>??????</Tag>],
                [2, <Tag color={'red'}>??????</Tag>]
              ])
              return tagMap.get(record.menuStatus)
            }
          },
          {
            title: '??????',
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
                  }}>??????</Button>
                  <Button type="link" onClick={() => {
                    setModalVisit(true)
                    setMenuId(record.id)
                  }}>??????</Button>
                  <Popconfirm
                    title="????????????????"
                    okText="??????"
                    cancelText="??????"
                    onConfirm={() => {
                      if (record.children) {
                        message.error('?????????????????????')
                      } else {
                        return deleteMenu.mutateAsync(record.id)
                      }
                    }}
                  >
                    <Button type="link">??????</Button>
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