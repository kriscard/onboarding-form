import { useState, useTransition } from "react";
import { UseFormSetError, UseFormClearErrors } from "react-hook-form";
import toast from "react-hot-toast";
import {
  validateCorporationNumber,
  type CorporationValidationResult,
} from "@/lib/actions/validateCorporationNumber";
import { type OnboardingSchemaType } from "@/lib/validations/onboarding";

interface UseAsyncCorporationValidationProps {
  setError: UseFormSetError<OnboardingSchemaType>;
  clearErrors: UseFormClearErrors<OnboardingSchemaType>;
}

export function useAsyncCorporationValidation({
  setError,
  clearErrors,
}: UseAsyncCorporationValidationProps) {
  const [validationResult, setValidationResult] =
    useState<CorporationValidationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleValidationResult = (result: CorporationValidationResult) => {
    setValidationResult(result);

    if (result.valid) {
      toast.success("Corporation number is valid!", { icon: "✅" });
      clearErrors("corporationNumber");
      return;
    }

    const errorMessage =
      result.message || result.error || "Invalid corporation number";
    toast.error(errorMessage, { icon: "❌" });
    setError("corporationNumber", { type: "server", message: errorMessage });
  };

  const validateAsync = async (corporationNumber: string) => {
    if (!corporationNumber || corporationNumber.length !== 9) {
      return;
    }

    const loadingToast = toast.loading("Validating corporation number...");

    startTransition(async () => {
      try {
        const result = await validateCorporationNumber(corporationNumber);
        handleValidationResult(result);
      } catch (error) {
        console.error("Corporation validation failed:", error);
        const errorResult: CorporationValidationResult = {
          valid: false,
          error: "Validation failed. Please try again.",
          timestamp: Date.now(),
        };
        handleValidationResult(errorResult);
      } finally {
        toast.dismiss(loadingToast);
      }
    });
  };

  return {
    validateAsync,
    isValidating: isPending,
    validationResult,
  };
}
