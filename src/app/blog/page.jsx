import BlogHome from "@/components/blog/BlogHome";
import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "../action";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <BlogHome currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
