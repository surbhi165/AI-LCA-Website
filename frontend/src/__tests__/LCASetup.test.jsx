import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LCASetup from "../pages/LCASetup";

describe("LCASetup", () => {
  test("renders LCASetup and calls onPredict when form is submitted", async () => {
    const mockOnPredict = jest.fn();
    render(<LCASetup onPredict={mockOnPredict} result={null} />);

    // Check heading
    expect(screen.getByText(/LCA Setup/i)).toBeInTheDocument();

    // Fill form fields
    const materialSelect = screen.getByLabelText(/Material Type/i);
    await userEvent.selectOptions(materialSelect, "Steel");

    const energyInput = screen.getByLabelText(/Energy Use/i);
    await userEvent.type(energyInput, "100");

    // Submit the form by firing submit event on the form element
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Expect onPredict to be called
    expect(mockOnPredict).toHaveBeenCalled();
  });

  test("displays results when result prop is provided", () => {
    const result = {
      predicted_emissions: 10,
      circularity_score: 50,
      recommendation: "Test recommendation",
    };
    render(<LCASetup onPredict={() => {}} result={result} />);

    // Use queryAllByText to handle multiple matching elements
    const predictionHeadings = screen.queryAllByText(/Prediction Results/i);
    expect(predictionHeadings.length).toBeGreaterThan(0);

    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
    expect(screen.getByText(/Test recommendation/i)).toBeInTheDocument();
  });
});
