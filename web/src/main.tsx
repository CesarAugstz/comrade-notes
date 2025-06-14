import './index.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AppRoutes from './shared/routes/app-routes.tsx'
import Toaster from './shared/components/toast/toast.tsx'
import Provider from './shared/components/provider/provider.tsx'

const root = document.getElementById('root')

if (!root) throw new Error('unable to find root element')

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Provider>
      <AppRoutes />
      <Toaster />
    </Provider>
  </BrowserRouter>
)
