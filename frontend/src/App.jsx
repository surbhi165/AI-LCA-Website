import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LCASetup from "./pages/LCASetup";
import Visualizations from "./pages/Visualizations";
import Comparisons from "./pages/Comparisons";
import Reports from "./pages/Reports";
import Dataset from "./pages/Dataset";
import NotFound from "./components/NotFound";

function App() {
  const [result, setResult] = useState(null);
  const [userRole, setUserRole] = useState("metallurgist"); // Default role

  const handlePredict = async (data) => {
    // Use the data passed from InputForm, which already includes the backend response with input data added
    setResult(data);
  };

  return (
    <Router>
      <div>
        {/* Beautiful Header */}
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-8 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide text-center text-yellow-400">
              AI LCA Pro
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90 text-center text-white">
              Advanced Life Cycle Assessment Platform
            </p>
          </div>
        </header>

        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-center space-x-8">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/configure"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Configure
              </NavLink>
              <NavLink
                to="/visualizations"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Insights
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Reports
              </NavLink>
              <NavLink
                to="/comparisons"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Comparisons
              </NavLink>
              <NavLink
                to="/dataset"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Dataset
              </NavLink>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard result={result} userRole={userRole} />} />
          <Route path="/configure" element={<LCASetup onPredict={handlePredict} result={result} userRole={userRole} />} />
          <Route path="/visualizations" element={<Visualizations result={result} userRole={userRole} />} />
          <Route path="/comparisons" element={<Comparisons result={result} userRole={userRole} />} />
          <Route path="/reports" element={<Reports result={result} userRole={userRole} />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
