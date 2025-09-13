import { Box, TextField, Text } from "@radix-ui/themes";
import { Label } from "radix-ui";
import { useFormContext, Controller } from "react-hook-form";
import type { OnboardingSchemaType } from "@/lib/validations/onboarding";
import { useAsyncCorporationValidation } from "@/lib/hooks/useAsyncCorporationValidation";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export function CorporationNumberInput() {
  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<OnboardingSchemaType>();

  const { validateAsync, isValidating } = useAsyncCorporationValidation({
    setError,
    clearErrors,
  });

  return (
    <Box>
      <Label.Root htmlFor="corporationNumber">
        <Text size="2" weight="medium">
          Corporation Number
        </Text>
      </Label.Root>
      <Controller
        name="corporationNumber"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField.Root
            {...field}
            id="corporationNumber"
            placeholder=""
            className="mt-2"
            color={errors.corporationNumber ? "red" : undefined}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              field.onChange(value);
            }}
            onBlur={(e) => {
              field.onBlur();
              const value = e.target.value.trim();
              if (value.length === 9) {
                validateAsync(value);
              }
            }}
          />
        )}
      />
      {isValidating && (
        <Text size="2" color="blue" className="mt-1">
          Validating corporation number...
        </Text>
      )}
      <ErrorMessage message={errors.corporationNumber?.message} />
    </Box>
  );
}
