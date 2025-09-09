import React, { useState, useEffect } from "react";
import SankeyDiagram from "../components/SankeyDiagram";

function Visualizations({ result, userRole }) {
  const [visualizationData, setVisualizationData] = useState(null);

  // Generate sample data for visualizations when result is available
  useEffect(() => {
    if (result) {
      // Simulate getting data from multiple predictions for charts
      const generateVisualizationData = async () => {
        const materials = ["Steel", "Aluminium", "Copper", "Nickel", "Zinc"];
        const data = [];

        for (const material of materials) {
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              energy_use: 25,
              recycled_content: 0.5,
              material_type: material,
              route: "raw",
              energy_source: "hydro",
              transport_mode: "ship",
              end_of_life: "recycle",
              quantity: 50,
              distance: 200
            })
          });
          const prediction = await response.json();
          data.push({
            material,
            emissions: prediction.predicted_emissions,
            circularity: prediction.circularity_score,
            energy: 25, // Base energy use
            transport: prediction.predicted_emissions * 0.3, // Estimated transport contribution
            production: prediction.predicted_emissions * 0.7  // Estimated production contribution
          });
        }

        setVisualizationData(data);
      };

      generateVisualizationData();
    }
  }, [result]);

  const maxEmissions = visualizationData ? Math.max(...visualizationData.map(d => d.emissions)) : 0;
  const maxCircularity = visualizationData ? Math.max(...visualizationData.map(d => d.circularity)) : 0;

  return (
    <div className="visualizations-container max-w-7xl mx-auto p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg text-justify">
      <h1 className="text-4xl font-extrabold text-green-900 mb-8 text-justify">📈 Visualizations</h1>
      <p className="text-lg text-green-700 mb-10 text-justify">
        Interactive charts and graphs showing LCA analysis and sustainability insights.
        <span className="block text-sm text-green-600 mt-2 text-justify">
          Current Role: <strong>{userRole === "metallurgist" ? "Metallurgist" : "Decision-maker"}</strong>
        </span>
      </p>

      {result && (
        <div className="mb-10 bg-white p-8 rounded-lg shadow-md border border-green-200">
          <h2 className="text-3xl font-semibold text-green-800 mb-6">Current Prediction Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800">Emissions</h3>
              <p className="text-2xl font-bold text-red-600">{result.predicted_emissions} kg CO₂</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Circularity Score</h3>
              <p className="text-2xl font-bold text-green-600">{result.circularity_score}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Recommendation</h3>
              <p className="text-sm text-blue-600">{result.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sankey Diagram */}
      {result && (
        <div className="mb-10">
          <SankeyDiagram data={result} />
        </div>
      )}

      {/* Role-based Insights */}
      {result && (
        <div className="mb-10 bg-white p-8 rounded-lg shadow-md border border-green-200">
          <h2 className="text-3xl font-semibold text-green-800 mb-6">
            {userRole === "metallurgist" ? "🔬 Technical Insights" : "💼 Business Impact Analysis"}
          </h2>

          {userRole === "metallurgist" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Material Properties</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Energy intensity: {result.predicted_emissions * 0.8} kWh/kg</li>
                    <li>• Carbon footprint: {result.predicted_emissions} kg CO₂/kg</li>
                    <li>• Recyclability: {result.circularity_score * 100}%</li>
                    <li>• Process efficiency: {(1 - result.predicted_emissions / 50) * 100}%</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Optimization Opportunities</h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Increase recycled content by 20% → Reduce emissions by 15%</li>
                    <li>• Switch to renewable energy → Reduce emissions by 25%</li>
                    <li>• Optimize transport routes → Reduce emissions by 10%</li>
                    <li>• Implement closed-loop recycling → Improve circularity by 30%</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">Cost-Benefit Analysis</h3>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• Annual savings: ${(result.predicted_emissions * 0.05 * 1000).toFixed(0)}</li>
                    <li>• ROI on sustainable practices: 180%</li>
                    <li>• Market premium for green products: 15-25%</li>
                    <li>• Regulatory compliance cost avoidance: $50K/year</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">Strategic Recommendations</h3>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li>• Target carbon reduction: 40% by 2030</li>
                    <li>• Invest in circular economy initiatives</li>
                    <li>• Partner with sustainable suppliers</li>
                    <li>• Communicate ESG achievements to stakeholders</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Material Comparison Charts */}
      {visualizationData && (
        <div className="space-y-8">
          {/* Energy Use Comparison Table */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">🔋 Energy Use Comparison Across Materials</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-green-300">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border border-green-300 px-4 py-3 text-left font-semibold text-green-800">Material</th>
                    <th className="border border-green-300 px-4 py-3 text-left font-semibold text-green-800">Energy Use (kWh)</th>
                    <th className="border border-green-300 px-4 py-3 text-left font-semibold text-green-800">Emissions (kg CO₂)</th>
                    <th className="border border-green-300 px-4 py-3 text-left font-semibold text-green-800">Circularity Score</th>
                    <th className="border border-green-300 px-4 py-3 text-left font-semibold text-green-800">Efficiency Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {visualizationData
                    .sort((a, b) => a.energy - b.energy)
                    .map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-green-50"}>
                      <td className="border border-green-300 px-4 py-3 font-semibold text-green-800">{item.material}</td>
                      <td className="border border-green-300 px-4 py-3">{item.energy} kWh</td>
                      <td className="border border-green-300 px-4 py-3">{item.emissions.toFixed(2)} kg CO₂</td>
                      <td className="border border-green-300 px-4 py-3">{item.circularity.toFixed(1)}</td>
                      <td className="border border-green-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.energy < 30 ? 'bg-green-100 text-green-800' :
                          item.energy < 35 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.energy < 30 ? 'High' : item.energy < 35 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Summary:</strong> Materials sorted by energy efficiency. Lower energy use indicates better performance.</p>
              <p><strong>Best Performer:</strong> {visualizationData.reduce((best, current) => current.energy < best.energy ? current : best).material} ({Math.min(...visualizationData.map(d => d.energy))} kWh)</p>
              <p><strong>Worst Performer:</strong> {visualizationData.reduce((worst, current) => current.energy > worst.energy ? current : worst).material} ({Math.max(...visualizationData.map(d => d.energy))} kWh)</p>
            </div>
          </div>

          {/* Emissions Comparison */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">🌡️ Emissions Comparison Across Materials</h2>
            <div className="flex items-end space-x-4 h-64">
              {visualizationData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-red-500 w-full rounded-t transition-all duration-500"
                    style={{ height: `${(item.emissions / maxEmissions) * 200}px` }}
                  ></div>
                  <div className="text-center mt-2">
                    <p className="font-semibold text-green-800">{item.material}</p>
                    <p className="text-sm text-gray-600">{item.emissions} kg CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Circularity Score Comparison */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">♻️ Circularity Score Comparison</h2>
            <div className="flex items-end space-x-4 h-64">
              {visualizationData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-green-500 w-full rounded-t transition-all duration-500"
                    style={{ height: `${(item.circularity / maxCircularity) * 200}px` }}
                  ></div>
                  <div className="text-center mt-2">
                    <p className="font-semibold text-green-800">{item.material}</p>
                    <p className="text-sm text-gray-600">{item.circularity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Charts - Impact Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visualizationData.slice(0, 2).map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Impact Breakdown - {item.material}</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-sm">Production: {item.production.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                    <span className="text-sm">Transport: {item.transport.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded mr-3"></div>
                    <span className="text-sm">Other: {(item.emissions - item.production - item.transport).toFixed(2)} kg CO₂</span>
                  </div>
                </div>
                <div className="mt-4 h-32 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 bg-blue-500 transition-all duration-500"
                    style={{ width: `${(item.production / item.emissions) * 100}%`, height: '100%' }}
                  ></div>
                  <div
                    className="absolute bottom-0 bg-orange-500 transition-all duration-500"
                    style={{
                      left: `${(item.production / item.emissions) * 100}%`,
                      width: `${(item.transport / item.emissions) * 100}%`,
                      height: '100%'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart Simulation - Sustainability Factors */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">🎯 Sustainability Factors Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visualizationData.slice(0, 3).map((item, index) => (
                <div key={index} className="text-center">
                  <h3 className="font-semibold text-green-800 mb-4">{item.material}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Energy Efficiency</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(40 - item.energy) / 40 * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Emissions</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(maxEmissions - item.emissions) / maxEmissions * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Circularity</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.circularity / maxCircularity * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Graph - Impact of Recycled Content */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-green-200">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">📊 Impact of Recycled Content on Emissions</h2>
            <div className="flex items-end space-x-2 h-64">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((recycled, index) => {
                const estimatedEmissions = result ? result.predicted_emissions * (1 - recycled * 0.3) : 20 * (1 - recycled * 0.3);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-gradient-to-t from-red-500 to-red-300 w-full rounded-t transition-all duration-500"
                      style={{ height: `${(estimatedEmissions / 25) * 200}px` }}
                    ></div>
                    <div className="text-center mt-2">
                      <p className="font-semibold text-green-800">{(recycled * 100).toFixed(0)}%</p>
                      <p className="text-sm text-gray-600">{estimatedEmissions.toFixed(1)} kg CO₂</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">Recycled Content Percentage</p>
          </div>
        </div>
      )}

      {!result && (
        <div className="mt-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <p className="font-semibold">Run a prediction to see visualizations</p>
          <p>Generate LCA results in the LCA Setup tab to unlock comprehensive charts and analysis.</p>
        </div>
      )}
    </div>
  );
}

export default Visualizations;
