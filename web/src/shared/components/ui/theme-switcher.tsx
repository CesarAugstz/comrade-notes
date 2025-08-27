import { useState, useEffect, useRef } from 'react'
import { Palette, Check } from 'lucide-react'

interface Theme {
  name: string
  value: string
}

const themes: Theme[] = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Cupcake', value: 'cupcake' },
  { name: 'Bumblebee', value: 'bumblebee' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Corporate', value: 'corporate' },
  { name: 'Synthwave', value: 'synthwave' },
  { name: 'Retro', value: 'retro' },
  { name: 'Cyberpunk', value: 'cyberpunk' },
  { name: 'Valentine', value: 'valentine' },
  { name: 'Halloween', value: 'halloween' },
  { name: 'Garden', value: 'garden' },
  { name: 'Forest', value: 'forest' },
  { name: 'Aqua', value: 'aqua' },
  { name: 'Lofi', value: 'lofi' },
  { name: 'Pastel', value: 'pastel' },
  { name: 'Fantasy', value: 'fantasy' },
  { name: 'Wireframe', value: 'wireframe' },
  { name: 'Black', value: 'black' },
  { name: 'Luxury', value: 'luxury' },
  { name: 'Dracula', value: 'dracula' },
  { name: 'CMYK', value: 'cmyk' },
  { name: 'Autumn', value: 'autumn' },
  { name: 'Business', value: 'business' },
  { name: 'Acid', value: 'acid' },
  { name: 'Lemonade', value: 'lemonade' },
  { name: 'Night', value: 'night' },
  { name: 'Coffee', value: 'coffee' },
  { name: 'Winter', value: 'winter' },
  { name: 'Dim', value: 'dim' },
  { name: 'Nord', value: 'nord' },
  { name: 'Sunset', value: 'sunset' },
]

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (themeValue: string) => {
    localStorage.setItem('theme', themeValue)
    document.documentElement.setAttribute('data-theme', themeValue)

    if (dropdownRef.current) {
      dropdownRef.current.blur()
    }
    setCurrentTheme(themeValue)
  }

  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        title="Change Theme"
      >
        <Palette className="w-5 h-5" />
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-[1] mt-3 w-80 max-h-96 overflow-y-auto bg-base-200 rounded-box shadow-xl"
      >
        <div className="p-4">
          <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Choose Theme
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {themes.map(theme => (
              <label key={theme.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme-radios"
                  className="radio radio-sm theme-controller sr-only"
                  value={theme.value}
                  onChange={() => handleThemeChange(theme.value)}
                />
                <div
                  className={`flex items-center justify-between p-3 rounded-lg transition-all hover:bg-base-300 ${
                    currentTheme === theme.value
                      ? 'bg-primary/10 ring-2 ring-primary/20'
                      : 'bg-base-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg bg-base-100 border shadow-sm"
                      data-theme={theme.value}
                    >
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <div className="w-3 h-3 rounded-full bg-accent" />
                      </div>
                    </div>
                    <span className="font-medium text-base-content">
                      {theme.name}
                    </span>
                  </div>
                  {currentTheme === theme.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
