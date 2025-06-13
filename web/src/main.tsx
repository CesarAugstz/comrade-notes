import './index.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from './components/ui/provider.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import AppRoutes from './shared/routes/app-routes.tsx'

const root = document.getElementById('root')

if (!root) throw new Error('unable to find root element')

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Provider enableColorScheme enableSystem>
      <AppRoutes />
      <Toaster />
    </Provider>
  </BrowserRouter>
)
