import { Link, useLocation } from 'react-router'
import { Heart, Home, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import ThemeSwitcher from '../ui/theme-switcher'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/wishlists', label: 'Wishlists', icon: Heart },
  ]

  const handleLogout = () => {
    logout()
    const drawerToggle = document.getElementById(
      'drawer-toggle'
    ) as HTMLInputElement
    if (drawerToggle) drawerToggle.checked = false
  }

  const closeDrawer = () => {
    const drawerToggle = document.getElementById(
      'drawer-toggle'
    ) as HTMLInputElement
    if (drawerToggle) drawerToggle.checked = false
  }

  return (
    <aside className="min-h-full w-80 bg-base-200 text-base-content">
      <div className="p-4">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold justify-start"
          onClick={closeDrawer}
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Comrade Notes
          </span>
        </Link>
      </div>

      <ul className="menu p-4 space-y-2">
        {navLinks.map(link => {
          const IconComponent = link.icon
          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 ${
                  isActive(link.path) ? 'active' : ''
                }`}
                onClick={closeDrawer}
              >
                <IconComponent className="w-5 h-5" />
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <ThemeSwitcher />
        </div>
      </div>

      {user ? (
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-sm flex items-center h-full justify-center font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm opacity-70">User</div>
            </div>
          </div>

          <ul className=" w-full menu p-0 space-y-1">
            <li>
              <a className="flex items-center gap-3">
                <User className="w-4 h-4" />
                Profile
                <span className="badge badge-sm">New</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3">Settings</a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-error hover:bg-error hover:text-error-content"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="p-4 border-t border-base-300 mt-auto">
          <Link
            to="/auth"
            className="btn btn-primary w-full"
            onClick={closeDrawer}
          >
            <User className="w-4 h-4" />
            Login
          </Link>
        </div>
      )}
    </aside>
  )
}
