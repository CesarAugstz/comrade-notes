import './index.css'
import App from './App.tsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route } from 'react-router'
import { Routes } from 'react-router'
import LoginPage from './features/auth/pages/LoginPage.tsx'
import { Provider } from './components/ui/provider.tsx'

const root = document.getElementById('root')

if (!root) throw new Error('unable to find root element')

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Provider enableColorScheme enableSystem>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="auth" element={<LoginPage />} />
      </Routes>
    </Provider>
  </BrowserRouter>
)
