import React from "react";
import Reports from "./Reports";

const mockResult = {
  material_type: "Steel",
  route: "raw",
  energy_source: "hydro",
  transport_mode: "ship",
  end_of_life: "recycle",
  predicted_emissions: 100,
  circularity_score: 60,
  energy_use: 25,
  recycled_content: 0.5,
  quantity: 50,
  distance: 200,
  recommendation: "Increase recycling to improve circularity."
};

function ReportsTest() {
  return <Reports result={mockResult} />;
}

export default ReportsTest;
