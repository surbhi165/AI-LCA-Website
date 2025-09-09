import React from "react";
import Results from "../Results";

function Dashboard({ result, userRole }) {
  // Mock data for demonstration - in a real app, this would come from an API
  const mockMetrics = {
    totalAssessments: 24,
    avgCarbonFootprint: 2.4,
    recentAssessments: 3,
    systemUptime: 99.9
  };

  const mockRecentActivity = [
    { id: 1, type: "assessment", material: "Steel", timestamp: "2 hours ago", status: "completed" },
    { id: 2, type: "assessment", material: "Aluminium", timestamp: "5 hours ago", status: "completed" },
    { id: 3, type: "assessment", material: "Copper", timestamp: "1 day ago", status: "completed" },
  ];

  return (
    <div className="dashboard-container max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg text-justify">
      {/* Compact Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1 text-justify">Dashboard</h1>
        <p className="text-sm text-gray-600 text-justify">Welcome back, {userRole === 'metallurgist' ? 'Metallurgist' : 'Designer'}. Here's your sustainability overview.</p>
      </div>

      {/* Compact Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Assessments</p>
              <p className="text-lg font-bold text-gray-900">{mockMetrics.totalAssessments}</p>
            </div>
            <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Avg Carbon Footprint</p>
              <p className="text-lg font-bold text-gray-900">{mockMetrics.avgCarbonFootprint} kg CO₂</p>
            </div>
            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-red-600 font-medium">+5%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Recent Assessments</p>
              <p className="text-lg font-bold text-gray-900">{mockMetrics.recentAssessments}</p>
            </div>
            <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-600 font-medium">Active</span>
            <span className="text-gray-500 ml-1">this week</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">System Status</p>
              <p className="text-lg font-bold text-gray-900">{mockMetrics.systemUptime}%</p>
            </div>
            <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-600 font-medium">Online</span>
            <span className="text-gray-500 ml-1">uptime</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest Results */}
        {result && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Latest Assessment</h2>
              <span className="text-xs text-gray-500">Just completed</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <Results result={result} />
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">View all</button>
          </div>
          <div className="space-y-2">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">{activity.material} Assessment</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!result && (
        <div className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-white mb-1">Ready to start your first assessment?</h3>
            <p className="text-purple-100 text-xs mb-3">Navigate to Configure to run your first LCA prediction.</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
