import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NameInputs } from "@/components/inputs/NameInputs";
import { describe, expect, it } from "vitest";
import { TestWrapper } from "../helpers/TestWrapper";

describe("NameInputs", () => {
  it("renders first name and last name inputs", () => {
    render(
      <TestWrapper>
        <NameInputs />
      </TestWrapper>,
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it("allows typing into both first and last name fields", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <NameInputs />
      </TestWrapper>,
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, "John");
    expect(firstNameInput).toHaveValue("John");

    const lastNameInput = screen.getByLabelText(/last name/i);
    await user.type(lastNameInput, "Doe");
    expect(lastNameInput).toHaveValue("Doe");
  });
});
