import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ConfigProvider } from 'antd'
import { HistoryRouter, history } from 'routes/history'
import App from 'App'
import 'antd/dist/antd.less'
import './global.less'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

// TODO
history.listen(({ action, location }) => {
  if (location.pathname === '/login') {
    queryClient.clear()
  }
})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <HistoryRouter history={history}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </HistoryRouter>
  </QueryClientProvider>,
  document.getElementById('root')
)