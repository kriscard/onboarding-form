import { FormProvider, useForm } from "react-hook-form";
import { Theme } from "@radix-ui/themes";
import React from "react";

export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return (
    <Theme>
      <FormProvider {...methods}>
        <form>{children}</form>
      </FormProvider>
    </Theme>
  );
};
