import AdminHome from "@/components/admin/AdminHome";
import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "../action";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <AdminHome currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
