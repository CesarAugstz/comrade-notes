import { Route, Routes, useNavigate } from 'react-router'
import App from '../../App'
import LoginPage from '../../features/auth/pages/LoginPage'
import { useAuthStore } from '../store/auth.store'
import { useEffect } from 'react'

export default function AppRoutes() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  console.log('isAuthenticate', isAuthenticated)
  useEffect(() => {
    if (!isAuthenticated) navigate('/auth')
  }, [isAuthenticated, navigate])

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="auth" element={<LoginPage />} />
    </Routes>
  )
}
