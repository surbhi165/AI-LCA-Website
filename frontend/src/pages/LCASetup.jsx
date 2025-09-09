import React from "react";
import InputForm from "../InputForm";
import Results from "../Results";

function LCASetup({ onPredict, result }) {
  return (
    <div className="lca-setup-container max-w-7xl mx-auto p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Configure</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Configure your Life Cycle Assessment parameters and run predictions.</p>

      <div className="flex justify-center">
        <InputForm onSubmit={onPredict} />
      </div>

      {result ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Prediction Results</h2>
          <Results result={result} />
        </div>
      ) : (
        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mx-auto max-w-md text-center">
          <p className="font-semibold text-center">No data available</p>
          <p className="text-center">Please fill the form and run a prediction.</p>
        </div>
      )}
    </div>
  );
}

export default LCASetup;
