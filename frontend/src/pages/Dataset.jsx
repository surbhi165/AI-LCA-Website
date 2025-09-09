import React, { useEffect, useState } from "react";

function Dataset() {
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/dataset");
        if (!response.ok) {
          throw new Error("Failed to fetch dataset");
        }
        const data = await response.json();
        setDataset(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, []);

  if (loading) {
    return <div>Loading dataset...</div>;
  }

  if (error) {
    return <div>Error loading dataset: {error}</div>;
  }

  if (!dataset.length) {
    return <div>No dataset available.</div>;
  }

  // Define column headers based on the provided dataset
  const columns = [
    "Material Type",
    "CO2 Emissions (kg CO2e)",
    "Circularity Score (/100)",
    "Energy Intensity (kWh/ton)",
    "Water Usage (L)",
    "SOx Emissions (kg)",
    "NOx Emissions (kg)",
    "Recycled Content (%)",
    "Resource Efficiency (%)",
    "Reuse/Recycling Potential (%)"
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dataset</h2>
      <div className="overflow-auto max-h-[600px] border border-gray-300 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataset.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {row[col] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dataset;
