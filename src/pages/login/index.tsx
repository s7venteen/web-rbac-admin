import React from 'react'
import { Navigate } from 'react-router-dom'
import { Card, Form, Input, Button, Divider } from 'antd'
import { useLogin } from 'hooks/useUser'
import type { AuthData } from 'services/user'
import { getToken } from 'utils/auth'
import './index.less'

const Login: React.FC = () => {
  const { isLoading, mutate } = useLogin()

  const handleLogin = (values: AuthData) => mutate(values)

  if (getToken()) {
    return <Navigate to={'/home'} />
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2 className="login-title">请登录</h2>
        <Form onFinish={handleLogin}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]} >
            <Input type="text" placeholder="用户名"></Input>
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input type="password" placeholder="密码"></Input>
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} htmlType="submit" type="primary" block>登录</Button>
          </Form.Item>
        </Form>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Button type="link">没有账号？注册新账号</Button>
        </div>
      </Card>
    </div>
  )
}

export default Login