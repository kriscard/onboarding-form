"use server";

import { revalidatePath } from "next/cache";
import { CorporationSchema } from "../validations/onboarding";

export interface CorporationValidationResult {
  valid: boolean;
  corporationNumber?: string;
  message?: string;
  error?: string;
  timestamp: number;
}

export async function validateCorporationNumber(
  corporationNumber: string,
): Promise<CorporationValidationResult> {
  const timestamp = Date.now();

  const validation = CorporationSchema.safeParse({ corporationNumber });

  if (!validation.success) {
    return {
      valid: false,
      error: validation.error.issues.map((issue) => issue.message).join(", "),
      timestamp,
    };
  }

  try {
    const apiUrl = `https://fe-hometask-api.qa.vault.tryvault.com/corporation-number/${validation.data.corporationNumber}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      const responseData = await response.json().catch(() => null);
      return {
        valid: false,
        error: responseData?.message || `API error: ${response.status}`,
        timestamp,
      };
    }

    const data = await response.json();

    revalidatePath("/");

    return {
      valid: data.valid === true,
      corporationNumber: data.corporationNumber,
      message: data.message,
      timestamp,
    };
  } catch (error) {
    console.error("Corporation number validation error:", error);

    return {
      valid: false,
      error: "An unexpected error occurred. Please try again.",
      timestamp,
    };
  }
}
