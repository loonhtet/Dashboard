import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const BookingDeleteForm = ({
  title,
  description,
  action,
  value,
  text,
  variant,
  loading,
}) => {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <form action={action} className="mt-4 text-right">
            <input type="hidden" name="id" value={value} />
            <div className="space-x-2">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant={variant} disabled={loading}>
                {loading && <Loader2 className="mr-2 animate-spin" />}
                {text}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default BookingDeleteForm;
