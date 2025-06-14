import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const AdminDeleteForm = ({
  title,
  description,
  action,
  value,
  text,
  variant,
}) => {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <form action={action} className="mt-4 text-right">
            <input type="hidden" name="id" value={value} />
            <Button type="submit" variant={variant}>
              {text}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default AdminDeleteForm;
