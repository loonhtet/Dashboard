import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

const BookingDetailModal = ({ datas, title }) => {
  return (
    <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto p-4 sm:max-w-[600px] sm:p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold sm:text-2xl">
          {title}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-sm sm:text-base">
          Detailed information about this booking.
        </DialogDescription>
      </DialogHeader>

      <Card className="border-none shadow-none">
        <CardContent className="grid gap-4 px-4 sm:gap-6 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Full Name</p>
              <p className="text-muted-foreground text-sm">
                {datas.full_name || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Email</p>
              <p className="text-muted-foreground text-sm">
                {datas.email_address || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">
                Phone Number
              </p>
              <p className="text-muted-foreground text-sm">
                {datas.phone_number || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Service</p>
              <p className="text-muted-foreground text-sm">
                {datas.service || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">Note</p>
            <p className="text-muted-foreground text-sm">
              {datas.note || "No additional notes provided"}
            </p>
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Created At</p>
              <p className="text-muted-foreground text-sm">
                {datas.created_at
                  ? format(new Date(datas.created_at), "dd MMM yyyy, hh:mm a")
                  : "Not available"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Updated At</p>
              <p className="text-muted-foreground text-sm">
                {datas.updated_at
                  ? format(new Date(datas.updated_at), "dd MMM yyyy, hh:mm a")
                  : "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  );
};

export default BookingDetailModal;
