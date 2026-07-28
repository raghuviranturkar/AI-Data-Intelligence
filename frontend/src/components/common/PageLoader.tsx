import React from 'react'
import Spinner from './Spinner'

const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  )
}

export default PageLoader
