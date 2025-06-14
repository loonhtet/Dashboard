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
            <Button type="submit" variant={variant} disabled={loading}>
              {loading && <Loader2 className="mr-2 animate-spin" />}
              {text}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default AdminDeleteForm;
