import type { ReactNode } from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="drawer">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">{children}</main>

        <footer className="footer footer-center p-4 sm:p-6 md:p-10 bg-base-200 text-base-content rounded-t-box mt-10 sm:mt-20">
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:text-base">
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Privacy Policy</a>
            <a className="link link-hover">Terms of Service</a>
          </nav>
          <aside className="text-center">
            <p className="text-xs sm:text-sm">
              Copyright © 2024 - All rights reserved by Comrade Notes
            </p>
          </aside>
        </footer>
      </div>

      <div className="drawer-side lg:hidden">
        <label
          htmlFor="drawer-toggle"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar />
      </div>
    </div>
  )
}
