import { Route, Routes, useNavigate } from 'react-router'
import LoginPage from '../../features/auth/pages/login-page'
import { useAuthStore } from '../store/auth.store'
import { useEffect } from 'react'
import WishlistsPage from '../../features/wishlists/pages/wishlists-page'
import WishlistDetailPage from '../../features/wishlists/pages/wishlist-detail-page'
import Layout from '../components/layout/layout'

export default function AppRoutes() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/auth')) {
      navigate('/auth')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated && !location.pathname.includes('/auth')) {
    return (
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<WishlistsPage />} />
        <Route path="/wishlists" element={<WishlistsPage />} />
        <Route path="/wishlists/:id" element={<WishlistDetailPage />} />
        <Route path="/auth" element={<LoginPage />} />
      </Routes>
    </Layout>
  )
}
