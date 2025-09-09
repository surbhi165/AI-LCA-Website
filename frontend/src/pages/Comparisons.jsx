import React, { useState, useEffect } from "react";

function Comparisons({ result }) {
  const [comparisonData, setComparisonData] = useState([]);
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  // Predefined comparison scenarios
  const scenarios = [
    { id: 1, name: "Steel vs Aluminium", materials: ["Steel", "Aluminium"], route: "raw", energy: "hydro", transport: "ship" },
    { id: 2, name: "Raw vs Recycled Copper", material: "Copper", routes: ["raw", "recycled"], energy: "coal", transport: "rail" },
    { id: 3, name: "Coal vs Solar Impact", material: "Steel", route: "raw", energies: ["coal", "solar"], transport: "road" },
    { id: 4, name: "Transport Mode Comparison", material: "Zinc", route: "raw", energy: "gas", transports: ["air", "ship"] },
    { id: 5, name: "End-of-Life Scenarios", material: "Lead", route: "recycled", energy: "hydro", transport: "road", endOfLife: ["recycle", "landfill"] }
  ];

  const runComparison = async (scenario) => {
    try {
      console.log("Running comparison for scenario:", scenario.name);
      const comparisons = [];

      if (scenario.materials) {
        // Material-to-Material comparison
        for (const material of scenario.materials) {
          console.log(`Fetching data for ${material}`);
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              energy_use: 25,
              recycled_content: 0.5,
              material_type: material,
              route: scenario.route,
              energy_source: scenario.energy,
              transport_mode: scenario.transport,
              end_of_life: "recycle",
              quantity: 50,
              distance: 200
            })
          });
          const data = await response.json();
          console.log(`Received data for ${material}:`, data);
          comparisons.push({ ...data, label: material });
        }
      } else if (scenario.routes) {
        // Route-to-Route comparison
        for (const route of scenario.routes) {
          console.log(`Fetching data for ${route} route`);
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              energy_use: 25,
              recycled_content: route === "recycled" ? 0.8 : 0.1,
              material_type: scenario.material,
              route: route,
              energy_source: scenario.energy,
              transport_mode: scenario.transport,
              end_of_life: "recycle",
              quantity: 50,
              distance: 200
            })
          });
          const data = await response.json();
          console.log(`Received data for ${route} route:`, data);
          comparisons.push({ ...data, label: route === "raw" ? "Raw Material" : "Recycled" });
        }
      } else if (scenario.energies) {
        // Energy source comparison
        for (const energy of scenario.energies) {
          console.log(`Fetching data for ${energy} energy`);
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              energy_use: 25,
              recycled_content: 0.5,
              material_type: scenario.material,
              route: scenario.route,
              energy_source: energy,
              transport_mode: scenario.transport,
              end_of_life: "recycle",
              quantity: 50,
              distance: 200
            })
          });
          const data = await response.json();
          console.log(`Received data for ${energy} energy:`, data);
          comparisons.push({ ...data, label: energy.charAt(0).toUpperCase() + energy.slice(1) });
        }
      } else if (scenario.transports) {
        // Transport mode comparison
        for (const transport of scenario.transports) {
          console.log(`Fetching data for ${transport} transport`);
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              energy_use: 25,
              recycled_content: 0.5,
              material_type: scenario.material,
              route: scenario.route,
              energy_source: scenario.energy,
              transport_mode: transport,
              end_of_life: "recycle",
              quantity: 50,
              distance: 200
            })
          });
          const data = await response.json();
          console.log(`Received data for ${transport} transport:`, data);
          comparisons.push({ ...data, label: transport.charAt(0).toUpperCase() + transport.slice(1) });
        }
      }

      console.log("Setting comparison data:", comparisons);
      setComparisonData(comparisons);
    } catch (error) {
      console.error("Error running comparison:", error);
      alert("Error fetching comparison data. Please check the console for details.");
    }
  };

  const maxEmissions = comparisonData.length > 0 ? Math.max(...comparisonData.map(d => d.predicted_emissions)) : 1;
  const maxCircularity = comparisonData.length > 0 ? Math.max(...comparisonData.map(d => d.circularity_score)) : 1;

  // Ensure minimum height for visibility
  const getBarHeight = (value, maxValue) => {
    const minHeight = 20; // Minimum height in pixels
    const calculatedHeight = (value / maxValue) * 200;
    return Math.max(calculatedHeight, minHeight);
  };

  return (
    <div className="comparisons-container max-w-7xl mx-auto p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg text-justify">
      <h1 className="text-4xl font-extrabold text-yellow-900 mb-8 text-justify">⚖️ Comparisons</h1>
      <p className="text-lg text-yellow-700 mb-10 text-justify">Compare different LCA scenarios side-by-side to find the most sustainable options.</p>

      {/* Scenario Selection */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-yellow-200">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Choose Comparison Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => runComparison(scenario)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonData.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-yellow-200">
          <h2 className="text-3xl font-semibold text-yellow-800 mb-6">Comparison Results</h2>

          {/* Comprehensive Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-yellow-300">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Scenario</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">CO₂ Emissions (kg)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Circularity Score</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Energy Intensity (kWh/ton)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Water Usage (L)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">SOx Emissions (kg)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">NOx Emissions (kg)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Recycled Content (%)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Resource Efficiency (%)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Reuse/Recycling Potential (%)</th>
                  <th className="border border-yellow-300 px-4 py-3 text-left font-semibold">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-yellow-50"}>
                    <td className="border border-yellow-300 px-4 py-3 font-semibold text-yellow-800">{item.label}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.predicted_emissions}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.circularity_score}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.energy_intensity}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.water_use}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.sox_emissions}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.nox_emissions}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.recycled_content_pct}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.resource_efficiency}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.reuse_recycling_potential}</td>
                    <td className="border border-yellow-300 px-4 py-3">{item.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Best Option Summary */}
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 rounded">
            <h3 className="font-semibold text-green-800">🏆 Best Option Summary</h3>
            <p className="text-green-700">
              <strong>{comparisonData.reduce((best, current) =>
                current.predicted_emissions < best.predicted_emissions ? current : best
              ).label}</strong> has the lowest CO₂ emissions at <strong>{
                Math.min(...comparisonData.map(d => d.predicted_emissions))
              } kg CO₂</strong>
            </p>
            <p className="text-green-700 mt-2">
              <strong>{comparisonData.reduce((best, current) =>
                current.circularity_score > best.circularity_score ? current : best
              ).label}</strong> has the highest circularity score at <strong>{
                Math.max(...comparisonData.map(d => d.circularity_score))
              }</strong>
            </p>
          </div>
        </div>
      )}

      {!result && comparisonData.length === 0 && (
        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-semibold">Select a comparison scenario</p>
          <p>Choose from the predefined scenarios above to see side-by-side comparisons of different LCA configurations.</p>
        </div>
      )}
    </div>
  );
}

export default Comparisons;
