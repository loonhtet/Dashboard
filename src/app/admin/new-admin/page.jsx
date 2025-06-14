import { getCurrentUser } from "@/app/action";
import NewAdmin from "@/components/admin/NewAdmin";
import WebLayout from "@/components/layouts/WebLayout";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <NewAdmin currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
