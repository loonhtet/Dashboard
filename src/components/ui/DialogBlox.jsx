import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./button";

const DialogBox = ({ text, variant, content }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant}>{text}</Button>
      </DialogTrigger>

      {content}
    </Dialog>
  );
};

export default DialogBox;
