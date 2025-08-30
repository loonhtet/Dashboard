import BookingHome from "@/components/booking/BookingHome";
import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "../action";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <BookingHome currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
