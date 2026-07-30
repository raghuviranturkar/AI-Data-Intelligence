import React from 'react'

const TestPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600">TEST PAGE - NEW ROUTE</h1>
      <p className="text-gray-600 mt-2">This is a completely new page!</p>
      <p className="text-sm text-gray-400 mt-4">If you can see this, routing is working correctly.</p>
    </div>
  )
}

export default TestPage
