import React from "react";
import { Sankey, Tooltip } from "recharts";

const SankeyDiagram = ({ data }) => {
  if (!data) return null;

  // Prepare nodes and links for Sankey
  // Example data structure expected:
  // nodes: [{ name: 'Raw Material' }, { name: 'Production' }, { name: 'Use' }, { name: 'End-of-Life' }]
  // links: [{ source: 0, target: 1, value: 100 }, ...]

  const nodes = [
    { name: "Raw Material" },
    { name: "Production" },
    { name: "Use" },
    { name: "End-of-Life" },
  ];

  // Create links based on real data values for each lifecycle stage
  const links = [
    { source: 0, target: 1, value: data.quantity || 100 }, // Raw Material to Production
    { source: 1, target: 2, value: data.predicted_emissions || 50 }, // Production to Use (using emissions as proxy)
    { source: 2, target: 3, value: data.circularity_score || 30 }, // Use to End-of-Life (using circularity score as proxy)
  ];

  return (
    <div className="sankey-diagram-container bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Lifecycle Flow - Sankey Diagram</h3>
      <Sankey
        width={700}
        height={300}
        data={{ nodes, links }}
        nodePadding={50}
        nodeWidth={15}
        link={{ stroke: "#8884d8" }}
        node={{ stroke: "#8884d8" }}
      >
        <Tooltip />
      </Sankey>
    </div>
  );
};

export default SankeyDiagram;
