import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}

export default ThemeToggle
