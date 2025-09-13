import { Box, Flex, TextField, Text } from "@radix-ui/themes";
import { Label } from "radix-ui";
import { useFormContext } from "react-hook-form";
import type { OnboardingSchemaType } from "@/lib/validations/onboarding";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export function NameInputs() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingSchemaType>();

  return (
    <Flex direction="row" gap="4">
      <Box className="flex-1">
        <Label.Root htmlFor="firstName">
          <Text size="2" weight="medium">
            First Name
          </Text>
        </Label.Root>
        <TextField.Root
          id="firstName"
          className="mt-2"
          color={errors.firstName ? "red" : undefined}
          {...register("firstName")}
        />
        <ErrorMessage message={errors.firstName?.message} />
      </Box>
      <Box className="flex-1">
        <Label.Root htmlFor="lastName">
          <Text size="2" weight="medium">
            Last Name
          </Text>
        </Label.Root>
        <TextField.Root
          id="lastName"
          className="mt-2"
          color={errors.lastName ? "red" : undefined}
          {...register("lastName")}
        />
        <ErrorMessage message={errors.lastName?.message} />
      </Box>
    </Flex>
  );
}
