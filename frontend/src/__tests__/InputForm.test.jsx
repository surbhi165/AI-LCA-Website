import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputForm from "../InputForm";

describe("InputForm", () => {
  test("renders form fields and submits data", async () => {
    const mockOnSubmit = jest.fn();
    render(<InputForm onSubmit={mockOnSubmit} />);

    // Check if Material Type select is in the document
    const materialSelect = screen.getByLabelText(/Material Type/i);
    expect(materialSelect).toBeInTheDocument();

    // Select a material type
    await userEvent.selectOptions(materialSelect, "Steel");
    expect(materialSelect.value).toBe("Steel");

    // Fill Energy Use input
    const energyInput = screen.getByLabelText(/Energy Use/i);
    await userEvent.type(energyInput, "100");
    expect(energyInput.value).toBe("100");

    // Submit the form by firing submit event on the form element
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Expect onSubmit to be called once
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    // Check the data passed to onSubmit
    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.material_type).toBe("Steel");
    expect(submittedData.energy_use).toBe(100);
  });
});
