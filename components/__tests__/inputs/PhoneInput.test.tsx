import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhoneInput } from "@/components/inputs/PhoneInput";
import { describe, expect, it } from "vitest";
import { TestWrapper } from "../helpers/TestWrapper";

describe("PhoneInput", () => {
  it("renders the phone number input", () => {
    render(
      <TestWrapper>
        <PhoneInput />
      </TestWrapper>,
    );

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("formats the phone number as the user types", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <PhoneInput />
      </TestWrapper>,
    );

    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(phoneInput, "5551234567");
    expect(phoneInput).toHaveValue("+15551234567");
  });

  it("strips non-digit characters and formats the number", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <PhoneInput />
      </TestWrapper>,
    );

    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.clear(phoneInput);
    await user.type(phoneInput, "(555) 123-4567");
    expect(phoneInput).toHaveValue("+15551234567");
  });
});
