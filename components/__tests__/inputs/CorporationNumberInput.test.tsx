import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CorporationNumberInput } from "@/components/inputs/CorporationNumberInput";
import { TestWrapper } from "../helpers/TestWrapper";

vi.mock("@/lib/hooks/useAsyncCorporationValidation", () => ({
  useAsyncCorporationValidation: () => ({
    validateAsync: vi.fn(),
    isValidating: false,
  }),
}));

describe("CorporationNumberInput", () => {
  it("renders the corporation number input", () => {
    render(
      <TestWrapper>
        <CorporationNumberInput />
      </TestWrapper>,
    );

    expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument();
  });

  it("strips non-digit characters from the input", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <CorporationNumberInput />
      </TestWrapper>,
    );

    const corpInput = screen.getByLabelText(/corporation number/i);

    await user.type(corpInput, "123-456-789");
    expect(corpInput).toHaveValue("123456789");
  });
});
