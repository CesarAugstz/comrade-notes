import { Link, useLocation } from 'react-router'
import { Menu, Heart, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import ThemeSwitcher from '../ui/theme-switcher'

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [{ path: '/wishlists', label: 'Wishlists', icon: Heart }]

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-40">
      <div className="navbar-start">
        <div className="lg:hidden">
          <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
            <Menu className="w-6 h-6" />
          </label>
        </div>

        <Link to="/" className="btn btn-ghost text-xl font-bold">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Comrade Notes
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks.map(link => {
            const IconComponent = link.icon
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 ${
                    isActive(link.path) ? 'active' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>

          {user ? (
            <div className="dropdown dropdown-end hidden lg:block">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  <span className="text-sm font-medium flex items-center h-full justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>{user.name}</span>
                </li>
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm hidden lg:flex">
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
