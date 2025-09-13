import { Box, TextField, Text } from "@radix-ui/themes";
import { Label } from "radix-ui";
import { useFormContext, Controller } from "react-hook-form";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { OnboardingSchemaType } from "@/lib/validations/onboarding";

export function PhoneInput() {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingSchemaType>();

  return (
    <Box>
      <Label.Root htmlFor="phone">
        <Text size="2" weight="medium">
          Phone Number
        </Text>
      </Label.Root>
      <Controller
        name="phone"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField.Root
            {...field}
            id="phone"
            placeholder="+1"
            className="mt-2"
            color={errors.phone ? "red" : undefined}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              field.onChange(formatted);
            }}
          />
        )}
      />
      <ErrorMessage message={errors.phone?.message} />
    </Box>
  );
}

function formatPhoneNumber(value: string): string {
  if (!value) {
    return "";
  }

  // Remove all non-digit characters.
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("1")) {
    digits = digits.substring(1);
  }

  const truncatedDigits = digits.slice(0, 10);

  if (truncatedDigits.length > 0) {
    return `+1${truncatedDigits}`;
  }

  return "";
}
