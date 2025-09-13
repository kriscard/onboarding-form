"use server";

import { revalidatePath } from "next/cache";
import {
  type OnboardingSchemaType,
  OnboardingSchema,
} from "../validations/onboarding";

export type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export async function createUser(
  data: OnboardingSchemaType,
): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = OnboardingSchema.safeParse(data);

  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, "");
    return {
      success: false,
      message: "",
      error: errorMessages,
    };
  }

  try {
    const response = await fetch(
      "https://fe-hometask-api.qa.vault.tryvault.com/profile-details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return {
        success: false,
        message: "",
        error: "Failed to create user",
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: `User ${result.data.firstName} ${result.data.lastName} created`,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "SERVER ERROR",
    };
  }
}
