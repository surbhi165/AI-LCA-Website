import React from "react";
import SankeyDiagram from "./components/SankeyDiagram";

function Results({ result }) {
  if (!result) return null;

  const downloadReport = () => {
    const report = `
AI-Powered LCA Assessment Report
Generated on: ${new Date().toLocaleString()}

=== ENVIRONMENTAL IMPACT ===
• CO₂ Emissions: ${result.predicted_emissions} kg CO₂e
• SOx Emissions: ${result.sox_emissions} kg
• NOx Emissions: ${result.nox_emissions} kg
• Water Usage: ${result.water_use} L
• Energy Intensity: ${result.energy_intensity} kWh/ton

=== CIRCULARITY METRICS ===
• Circularity Score: ${result.circularity_score}/100
• Recycled Content: ${result.recycled_content_pct}%
• Resource Efficiency: ${result.resource_efficiency}%
• Reuse/Recycling Potential: ${result.reuse_recycling_potential}%

=== RECOMMENDATIONS ===
${result.recommendation}

=== ASSESSMENT PARAMETERS ===
• Material: ${result.material_type || 'N/A'}
• Route: ${result.route || 'N/A'}
• Energy Source: ${result.energy_source || 'N/A'}
• Transport: ${result.transport_mode || 'N/A'}
• End-of-Life: ${result.end_of_life || 'N/A'}
• Quantity: ${result.quantity || 'N/A'} kg
• Distance: ${result.distance || 'N/A'} km
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lca_assessment_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-justify">
      <h2 className="text-justify">Assessment Results</h2>
      <button onClick={downloadReport} className="text-justify mb-4">Download Report</button>

      <div className="text-justify space-y-2">
        <p>CO₂ Emissions: {result.predicted_emissions} kg CO₂e</p>
        <p>Circularity Score: {result.circularity_score}/100</p>
        <p>Energy Intensity: {result.energy_intensity} kWh/ton</p>
        <p>Water Usage: {result.water_use} L</p>
        <p>SOx Emissions: {result.sox_emissions} kg</p>
        <p>NOx Emissions: {result.nox_emissions} kg</p>
        <p>Recycled Content: {result.recycled_content_pct}%</p>
        <p>Resource Efficiency: {result.resource_efficiency}%</p>
        <p>Reuse/Recycling Potential: {result.reuse_recycling_potential}%</p>
      </div>

      <div className="mt-6">
        <h3>Lifecycle Flow</h3>
        <SankeyDiagram data={result} />
      </div>
    </div>
  );
}

export default Results;
