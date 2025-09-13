import { Text } from "@radix-ui/themes";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className = "mt-1" }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <Text size="2" color="red" className={className}>
      {message}
    </Text>
  );
}