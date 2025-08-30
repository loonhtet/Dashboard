import CategoryHome from "@/components/category/CategoryHome";
import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "../action";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <CategoryHome currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
