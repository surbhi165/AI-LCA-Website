import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Dashboard
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these pages:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link to="/lca-setup" className="text-blue-600 hover:text-blue-800 underline">
                Configure
              </Link>
              <Link to="/visualizations" className="text-blue-600 hover:text-blue-800 underline">
                Insights
              </Link>
              <Link to="/reports" className="text-blue-600 hover:text-blue-800 underline">
                Reports
              </Link>
              <Link to="/comparisons" className="text-blue-600 hover:text-blue-800 underline">
                Comparisons
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
