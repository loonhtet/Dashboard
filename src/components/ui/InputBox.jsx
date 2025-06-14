import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputBox = ({
  name,
  label,
  register,
  errors,
  validation,
  type = "text",
  ...props
}) => {
  const error = errors?.[name];

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        {...props}
        {...register(name, validation)}
        aria-invalid={error ? "true" : "false"}
        className={"mt-0"}
      />
      {error && (
        <p className="text-destructive text-sm font-medium">{error.message}</p>
      )}
    </div>
  );
};

export default InputBox;
