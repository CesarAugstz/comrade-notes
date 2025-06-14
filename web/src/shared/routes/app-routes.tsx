import { Route, Routes, useNavigate } from 'react-router'
import LoginPage from '../../features/auth/pages/login-page'
import { useAuthStore } from '../store/auth.store'
import { useEffect } from 'react'
import Home from '../../features/home/home'

export default function AppRoutes() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth')
  }, [isAuthenticated, navigate])

  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="auth" element={<LoginPage />} />
    </Routes>
  )
}
