import { getCurrentUser } from "@/app/action";
import NewBlog from "@/components/blog/NewBlog";
import WebLayout from "@/components/layouts/WebLayout";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <NewBlog currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
