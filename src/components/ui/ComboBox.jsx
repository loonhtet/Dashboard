"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const Combobox = ({
  name,
  label,
  register,
  errors,
  validation,
  data = [],
  placeholder = "Select...",
  setValue,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const error = errors?.[name];

  React.useEffect(() => {
    if (register) {
      register(name, validation);
    }
  }, [name, register, validation]);

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={name}>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selected ? selected.name : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${label || "option"}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      setSelected(item); // store full object
                      setValue(name, item.id); // ✅ update form with category id
                      setOpen(false);
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        selected?.id === item.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-destructive text-sm font-medium">{error.message}</p>
      )}
    </div>
  );
};

export default Combobox;
