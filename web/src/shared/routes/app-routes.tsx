import { Route, Routes, useNavigate } from 'react-router'
import LoginPage from '../../features/auth/pages/login-page'
import { useAuthStore } from '../store/auth.store'
import { useEffect } from 'react'
import WishlistsPage from '../../features/wishlists/pages/wishlists-page'
import WishlistDetailPage from '../../features/wishlists/pages/wishlist-detail-page'

export default function AppRoutes() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth')
  }, [isAuthenticated, navigate])

  return (
    <Routes>
      <Route path="/" index element={<WishlistsPage />} />
      <Route path="/wishlists" element={<WishlistsPage />} />
      <Route path="/wishlists/:id" element={<WishlistDetailPage />} />
      <Route path="auth" element={<LoginPage />} />
    </Routes>
  )
}
