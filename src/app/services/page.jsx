import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "../action";
import ServicesHome from "@/components/services/ServicesHome";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <ServicesHome currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
