"use client";

import { Box, Card, Flex, Heading } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingSchema,
  type OnboardingSchemaType,
} from "@/lib/validations/onboarding";
import { NameInputs } from "./inputs/NameInputs";
import { PhoneInput } from "./inputs/PhoneInput";
import { CorporationNumberInput } from "./inputs/CorporationNumberInput";
import toast from "react-hot-toast";
import { createUser } from "@/lib/actions/createUser";

export function OnboardingForm() {
  const methods = useForm<OnboardingSchemaType>({
    resolver: zodResolver(OnboardingSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      corporationNumber: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValidating },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const response = await createUser(data);
    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success("User created!");
      reset();
    }
  });

  return (
    <FormProvider {...methods}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="min-h-screen bg-gray-100"
        gap="5"
      >
        <Card className="w-full max-w-md mx-4">
          <Box className="pb-8">
            <Heading as="h1" className="text-center" weight="light">
              Onboarding Form
            </Heading>
          </Box>
          <form onSubmit={onSubmit}>
            <Flex direction="column" gap="6">
              <NameInputs />
              <PhoneInput />
              <CorporationNumberInput />
              <button
                type="submit"
                disabled={isSubmitting || isValidating}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white mt-4 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <Flex align="center" justify="center" gap="2">
                  {isSubmitting
                    ? "Submitting..."
                    : isValidating
                      ? "Validating..."
                      : "Submit"}
                  {!isSubmitting && !isValidating && <ArrowRightIcon />}
                </Flex>
              </button>
            </Flex>
          </form>
        </Card>
      </Flex>
    </FormProvider>
  );
}
