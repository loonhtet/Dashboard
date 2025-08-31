"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./button";
import { useState } from "react";

const DialogBox = ({ text, variant, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>{text}</Button>
      </DialogTrigger>

      {typeof content === "function" ? content({ setOpen }) : content}
    </Dialog>
  );
};

export default DialogBox;
