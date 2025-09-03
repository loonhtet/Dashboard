import { getCurrentUser } from "@/app/action";
import WebLayout from "@/components/layouts/WebLayout";
import NewServices from "@/components/services/NewServices";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <NewServices currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
