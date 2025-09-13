import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, expect, beforeEach } from "vitest";
import toast from "react-hot-toast";
import { Theme } from "@radix-ui/themes";

import { OnboardingForm } from "@/components/OnboardingForm";
import { createUser } from "@/lib/actions/createUser";
import { validateCorporationNumber } from "@/lib/actions/validateCorporationNumber";

vi.mock("@/lib/actions/createUser");
vi.mock("@/lib/actions/validateCorporationNumber");
vi.mock("react-hot-toast");

const mockedCreateUser = vi.mocked(createUser);
const mockedValidateCorpNumber = vi.mocked(validateCorporationNumber);

describe("OnboardingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedValidateCorpNumber.mockResolvedValue({
      valid: true,
      timestamp: Date.now(),
    });
  });

  it("should allow a user to fill out the form and submit successfully and reset state", async () => {
    const user = userEvent.setup();
    mockedCreateUser.mockResolvedValue({
      success: true,
      message: "User created",
    });

    render(
      <Theme>
        <OnboardingForm />
      </Theme>,
    );

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/phone number/i), "5551234567");
    await user.type(screen.getByLabelText(/corporation number/i), "123456789");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockedCreateUser).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        phone: "+15551234567",
        corporationNumber: "123456789",
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("User created!");
    });

    expect(screen.getByLabelText(/first name/i)).toHaveValue("");
  });

  it("should show an error toast if submission fails and not reset form", async () => {
    const user = userEvent.setup();
    mockedCreateUser.mockResolvedValue({
      success: false,
      message: "",
      error: "Server failed",
    });

    render(
      <Theme>
        <OnboardingForm />
      </Theme>,
    );

    await user.type(screen.getByLabelText(/first name/i), "Jane");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/phone number/i), "5559876543");
    await user.type(screen.getByLabelText(/corporation number/i), "987654321");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server failed");
    });

    expect(screen.getByLabelText(/first name/i)).toHaveValue("Jane");
  });

  it("should show client-side validation errors for invalid input", async () => {
    const user = userEvent.setup();
    render(
      <Theme>
        <OnboardingForm />
      </Theme>,
    );

    await user.type(screen.getByLabelText(/first name/i), "John123");
    await user.type(screen.getByLabelText(/phone number/i), "123");

    await waitFor(() => {
      expect(
        screen.getByText(/first name can only contain letters/i),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/phone number must be a valid canadian number/i),
      ).toBeInTheDocument();
    });
  });

  it("should show a server validation error if the corporation number is invalid", async () => {
    const user = userEvent.setup();

    mockedValidateCorpNumber.mockResolvedValue({
      valid: false,
      error: "This corporation number is not registered.",
      timestamp: Date.now(),
    });

    render(
      <Theme>
        <OnboardingForm />
      </Theme>,
    );

    const corpInput = screen.getByLabelText(/corporation number/i);

    await user.type(corpInput, "111222333");

    await user.tab();

    const errorMessage = await screen.findByText(
      /this corporation number is not registered/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
