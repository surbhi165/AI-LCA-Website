import React, { useState, useEffect } from "react";

function Reports({ result, userRole }) {
  const [reportType, setReportType] = useState("single");
  const [comparisonData, setComparisonData] = useState([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState(["Steel", "Aluminium"]);

  // Scenario-specific parameters state
  const [energyUse, setEnergyUse] = useState(25);
  const [recycledContent, setRecycledContent] = useState(0.5);
  const [route, setRoute] = useState("raw");
  const [energySource, setEnergySource] = useState("hydro");
  const [transportMode, setTransportMode] = useState("ship");
  const [endOfLife, setEndOfLife] = useState("recycle");
  const [quantity, setQuantity] = useState(50);
  const [distance, setDistance] = useState(200);

  const materials = ["Steel", "Aluminium", "Copper", "Nickel", "Zinc", "Lead", "Titanium", "Magnesium", "Chromium", "Manganese"];

  // Generate comparison data for reports
  useEffect(() => {
    if (result && reportType === "comparison") {
          const generateComparisonData = async () => {
            if (selectedMaterials.length === 0) {
              setComparisonData([]);
              return;
            }
            setComparisonLoading(true);
            setComparisonError(null);
            try {
              const data = [];
              for (const material of selectedMaterials) {
                console.log(`Fetching prediction for ${material} with parameters:`, {
                  energyUse,
                  recycledContent,
                  route,
                  energySource,
                  transportMode,
                  endOfLife,
                  quantity,
                  distance,
                });
                const response = await fetch("http://127.0.0.1:8000/predict", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    energy_use: energyUse,
                    recycled_content: recycledContent,
                    material_type: material,
                    route: route,
                    energy_source: energySource,
                    transport_mode: transportMode,
                    end_of_life: endOfLife,
                    quantity: quantity,
                    distance: distance,
                  }),
                });
                if (!response.ok) {
                  throw new Error(`Failed to fetch prediction for ${material}: ${response.statusText}`);
                }
                const prediction = await response.json();
                console.log(`Received prediction for ${material}:`, prediction);
                data.push({
                  material,
                  ...prediction,
                  energyUse,
                  transportContribution: prediction.predicted_emissions * 0.3,
                  productionContribution: prediction.predicted_emissions * 0.7,
                });
              }
              setComparisonData(data);
            } catch (error) {
              console.error("Error fetching comparison data:", error);
              alert("Error fetching comparison data. Please check the console for details.");
              setComparisonError(error.message);
              setComparisonData([]);
            } finally {
              setComparisonLoading(false);
            }
          };
          generateComparisonData();
        }
      }, [result, reportType, selectedMaterials, energyUse, recycledContent, route, energySource, transportMode, endOfLife, quantity, distance]);

  const generateSingleMaterialReport = () => {
    if (!result) return;

    const report = `
AI-POWERED LCA TOOL - SINGLE MATERIAL REPORT
=============================================

Report Generated: ${new Date().toLocaleString()}

MATERIAL ANALYSIS
-----------------
Material Type: ${result.material_type || "N/A"}
Route: ${result.route || "N/A"}
Energy Source: ${result.energy_source || "N/A"}
Transport Mode: ${result.transport_mode || "N/A"}
End-of-Life: ${result.end_of_life || "N/A"}

QUANTITATIVE RESULTS
--------------------
Predicted Emissions: ${result.predicted_emissions || "N/A"} kg CO₂
Circularity Score: ${result.circularity_score || "N/A"}
Energy Use: ${result.energy_use || "N/A"} kWh
Recycled Content: ${result.recycled_content || "N/A"}%
Quantity: ${result.quantity || "N/A"} kg
Distance: ${result.distance || "N/A"} km

RECOMMENDATIONS
---------------
${result.recommendation || "N/A"}

SUSTAINABILITY INSIGHTS
-----------------------
• This material configuration produces ${result.predicted_emissions || "N/A"} kg CO₂ emissions
• Circularity score of ${result.circularity_score || "N/A"} indicates ${result.circularity_score > 50 ? "good" : "moderate"} circularity potential
• Consider optimizing transport and energy source for better environmental performance

Generated by AI-Powered LCA Tool
© 2024 Sustainability Analytics
    `;

    downloadReport(report, "single_material_lca_report.txt");
  };

  const generateComparisonReport = () => {
    if (comparisonData.length === 0) return;

    const bestOption = comparisonData.reduce((best, current) =>
      current.predicted_emissions < best.predicted_emissions ? current : best
    );

    const report = `
AI-POWERED LCA TOOL - MATERIAL COMPARISON REPORT
================================================

Report Generated: ${new Date().toLocaleString()}

COMPARISON OVERVIEW
-------------------
Materials Compared: ${selectedMaterials.join(", ")}
Energy Source: Hydro
Transport Mode: Ship
Route: Raw Material
End-of-Life: Recycle

COMPARISON RESULTS
==================

${comparisonData.map((item, index) => `
${index + 1}. ${item.material}
   Emissions: ${item.predicted_emissions} kg CO₂
   Circularity Score: ${item.circularity_score}
   Energy Use: ${item.energyUse} kWh
   Recommendation: ${item.recommendation}
`).join("\n")}

BEST OPTION: ${bestOption.material}
----------------------------------
🏆 ${bestOption.material} has the lowest emissions at ${bestOption.predicted_emissions} kg CO₂
   - Circularity Score: ${bestOption.circularity_score}
   - Energy Efficiency: ${bestOption.energyUse} kWh
   - Recommendation: ${bestOption.recommendation}

EXECUTIVE SUMMARY
=================
This comparison analysis shows that ${bestOption.material} provides the most sustainable option
among the evaluated materials under the current configuration.

Key Findings:
• Emission range: ${Math.min(...comparisonData.map(d => d.predicted_emissions))} - ${Math.max(...comparisonData.map(d => d.predicted_emissions))} kg CO₂
• Best performer: ${bestOption.material} (${bestOption.predicted_emissions} kg CO₂)
• Average emissions: ${(comparisonData.reduce((sum, d) => sum + d.predicted_emissions, 0) / comparisonData.length).toFixed(2)} kg CO₂

RECOMMENDATIONS FOR DECISION MAKERS
===================================
1. Prioritize ${bestOption.material} for applications requiring low environmental impact
2. Consider recycled content optimization to further reduce emissions
3. Evaluate renewable energy sources for additional sustainability benefits
4. Implement circular economy practices to improve overall circularity scores

Generated by AI-Powered LCA Tool
© 2024 Sustainability Analytics
    `;

    downloadReport(report, "material_comparison_report.txt");
  };

  const generateExecutiveSummary = () => {
    if (!result && comparisonData.length === 0) return;

    const report = `
EXECUTIVE SUMMARY - LCA ANALYSIS
================================

AI-POWERED LCA TOOL REPORT
Generated: ${new Date().toLocaleString()}

STRATEGIC INSIGHTS
==================

${result ? `
CURRENT ANALYSIS
----------------
Primary Material: ${result.material_type || "N/A"}
Total Emissions: ${result.predicted_emissions} kg CO₂
Circularity Score: ${result.circularity_score}
Energy Source: ${result.energy_source || "N/A"}
Transport Mode: ${result.transport_mode || "N/A"}

Key Performance Indicators:
• Carbon Footprint: ${result.predicted_emissions} kg CO₂ per unit
• Circularity Rating: ${result.circularity_score > 70 ? "High" : result.circularity_score > 50 ? "Medium" : "Low"}
• Sustainability Score: ${((100 - result.predicted_emissions/50*100) + result.circularity_score)/2}%

` : ""}

${comparisonData.length > 0 ? `
MATERIAL COMPARISON INSIGHTS
-----------------------------
Analysis of ${comparisonData.length} materials reveals:
• Best Option: ${comparisonData.reduce((best, current) => current.predicted_emissions < best.predicted_emissions ? current : best).material}
• Emission Range: ${Math.min(...comparisonData.map(d => d.predicted_emissions))} - ${Math.max(...comparisonData.map(d => d.predicted_emissions))} kg CO₂
• Average Circularity: ${(comparisonData.reduce((sum, d) => sum + d.circularity_score, 0) / comparisonData.length).toFixed(1)}

` : ""}

RECOMMENDED ACTIONS
===================

1. MATERIAL SELECTION
   • Choose materials with lowest carbon footprint
   • Prioritize materials with high circularity potential
   • Consider local sourcing to reduce transport emissions

2. PROCESS OPTIMIZATION
   • Implement renewable energy sources
   • Increase recycled content percentage
   • Optimize transport and logistics

3. CIRCULAR ECONOMY INITIATIVES
   • Design for recyclability
   • Implement take-back programs
   • Partner with recycling facilities

4. MONITORING & REPORTING
   • Track carbon emissions regularly
   • Set sustainability KPIs
   • Report progress to stakeholders

FINANCIAL IMPLICATIONS
======================
• Potential cost savings through material optimization
• Compliance with environmental regulations
• Enhanced brand reputation and customer loyalty
• Access to green financing opportunities

CONCLUSION
==========
This LCA analysis provides data-driven insights for sustainable decision-making.
Implementation of recommended actions can significantly reduce environmental impact
while maintaining operational efficiency.

For detailed analysis and implementation support, contact the sustainability team.

Generated by AI-Powered LCA Tool
© 2024 Sustainability Analytics
    `;

    downloadReport(report, "executive_summary_report.txt");
  };

  const downloadReport = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-container max-w-7xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-lg text-justify">
      <h1 className="text-4xl font-extrabold text-pink-900 mb-8 text-justify">📋 Reports</h1>
      <p className="text-lg text-pink-700 mb-10 text-justify">Generate comprehensive LCA reports and sustainability insights.</p>

      {/* Report Type Selection */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-pink-200">
        <h2 className="text-2xl font-semibold text-pink-800 mb-4">Report Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setReportType("single")}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === "single"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-300 hover:border-pink-300"
            }`}
          >
            <h3 className="font-semibold text-white">📄 Single Material Report</h3>
            <p className="text-sm mt-2 text-white">Detailed analysis of one material configuration</p>
          </button>
          <button
            onClick={() => setReportType("comparison")}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === "comparison"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-300 hover:border-pink-300"
            }`}
          >
            <h3 className={`font-semibold ${reportType === "comparison" ? "text-white" : "text-pink-800"}`}>⚖️ Comparison Report</h3>
            <p className={`text-sm mt-2 ${reportType === "comparison" ? "text-white" : "text-pink-700"}`}>Side-by-side analysis of multiple materials</p>
          </button>
          <button
            onClick={() => setReportType("executive")}
            className={`p-4 rounded-lg border-2 transition-all ${
              reportType === "executive"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-300 hover:border-pink-300"
            }`}
          >
            <h3 className={`font-semibold ${reportType === "executive" ? "text-white" : "text-pink-800"}`}>📊 Executive Summary</h3>
            <p className={`text-sm mt-2 ${reportType === "executive" ? "text-white" : "text-pink-700"}`}>Strategic insights and recommendations</p>
          </button>
        </div>
        {/* Predefined Comparison Scenarios */}
        {reportType === "comparison" && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-pink-800 mb-4">Choose Comparison Scenario</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedMaterials(["Steel", "Aluminium"]);
                  setRoute("raw");
                  setEnergySource("hydro");
                  setTransportMode("ship");
                  setEndOfLife("recycle");
                }}
              >
                Steel vs Aluminium
              </button>
              <button
                className="bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedMaterials(["Copper"]);
                  setRoute("raw");
                  setRecycledContent(0.1);
                  setEnergySource("coal");
                  setTransportMode("rail");
                  setEndOfLife("recycle");
                }}
              >
                Raw vs Recycled Copper
              </button>
              <button
                className="bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedMaterials(["Steel"]);
                  setRoute("raw");
                  setEnergySource("coal");
                  setTransportMode("road");
                  setEndOfLife("recycle");
                }}
              >
                Coal vs Solar Impact
              </button>
              <button
                className="bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedMaterials(["Zinc"]);
                  setRoute("raw");
                  setEnergySource("gas");
                  setTransportMode("air");
                  setEndOfLife("recycle");
                }}
              >
                Transport Mode Comparison
              </button>
              <button
                className="bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedMaterials(["Lead"]);
                  setRoute("recycled");
                  setEnergySource("hydro");
                  setTransportMode("road");
                  setEndOfLife("recycle");
                }}
              >
                End-of-Life Scenarios
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Single Material Report */}
      {reportType === "single" && result && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200 mb-8">
          <h2 className="text-3xl font-semibold text-pink-800 mb-6">📄 Single Material LCA Report</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-800 mb-2">Material Configuration</h3>
              <p><strong>Material:</strong> {result.material_type || "N/A"}</p>
              <p><strong>Route:</strong> {result.route || "N/A"}</p>
              <p><strong>Energy Source:</strong> {result.energy_source || "N/A"}</p>
              <p><strong>Transport:</strong> {result.transport_mode || "N/A"}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Key Results</h3>
              <p><strong>Emissions:</strong> {result.predicted_emissions} kg CO₂</p>
              <p><strong>Circularity Score:</strong> {result.circularity_score}</p>
              <p><strong>Recommendation:</strong> {result.recommendation}</p>
            </div>
          </div>

          <button
            onClick={generateSingleMaterialReport}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200"
          >
            📥 Download Single Material Report
          </button>
        </div>
      )}

      {/* Comparison Report */}
      {reportType === "comparison" && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200 mb-8">
          <h2 className="text-3xl font-semibold text-pink-800 mb-6">⚖️ Material Comparison Report</h2>

          {/* Material Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-pink-800 mb-3">Select Materials to Compare</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {materials.map((material) => (
                <label key={material} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMaterials([...selectedMaterials, material]);
                      } else {
                        setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                      }
                    }}
                    className="mr-2"
                  />
                  {material}
                </label>
              ))}
            </div>
          </div>

          {/* Comparison Results */}
          {comparisonLoading && (
            <div className="mb-6 text-pink-600 font-semibold">Loading comparison data...</div>
          )}
          {comparisonError && (
            <div className="mb-6 text-red-600 font-semibold">Error: {comparisonError}</div>
          )}
          {comparisonData.length > 0 && !comparisonLoading && !comparisonError && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-pink-800 mb-4">Comparison Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-pink-300">
                  <thead>
                    <tr className="bg-pink-100">
                      <th className="border border-pink-300 px-4 py-2 text-left">Material</th>
                      <th className="border border-pink-300 px-4 py-2 text-left">Emissions (kg CO₂)</th>
                      <th className="border border-pink-300 px-4 py-2 text-left">Circularity Score</th>
                      <th className="border border-pink-300 px-4 py-2 text-left">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                        <td className="border border-pink-300 px-4 py-2 font-semibold">{item.material}</td>
                        <td className="border border-pink-300 px-4 py-2">{item.predicted_emissions}</td>
                        <td className="border border-pink-300 px-4 py-2">{item.circularity_score}</td>
                        <td className="border border-pink-300 px-4 py-2">{item.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={generateComparisonReport}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200"
          >
            📥 Download Comparison Report
          </button>
        </div>
      )}

      {/* Executive Summary */}
      {reportType === "executive" && (
        <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200 mb-8">
          <h2 className="text-3xl font-semibold text-pink-800 mb-6">📊 Executive Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Strategic Insights</h3>
              <ul className="text-sm space-y-1">
                <li>• Data-driven decision making</li>
                <li>• Sustainability optimization</li>
                <li>• Cost-benefit analysis</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Key Benefits</h3>
              <ul className="text-sm space-y-1">
                <li>• Reduced carbon footprint</li>
                <li>• Improved circularity</li>
                <li>• Enhanced brand reputation</li>
                <li>• Operational efficiency</li>
              </ul>
            </div>
          </div>

          <button
            onClick={generateExecutiveSummary}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200"
          >
            📥 Download Executive Summary
          </button>
        </div>
      )}

      {!result && reportType === "single" && (
        <div className="mt-8 bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-4 rounded">
          <p className="font-semibold">Run a prediction first</p>
          <p>Generate LCA results in the LCA Setup tab to create detailed reports.</p>
        </div>
      )}
    </div>
  );
}

export default Reports;
