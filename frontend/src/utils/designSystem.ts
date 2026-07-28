/**
 * Design System Constants
 * Centralized values for visual consistency
 */

export const designSystem = {
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },

  // Border Radius
  radius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    ease: 'ease-in-out',
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Colors - these should match tailwind.config.js
  colors: {
    primary: {
      50: '#EEF2FF',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
    },
    success: {
      50: '#F0FDF4',
      500: '#22C55E',
      600: '#16A34A',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706',
    },
    danger: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
    },
  },
}

export default designSystem
