import { getCurrentUser } from "@/app/action";
import UpdateBlog from "@/components/blog/UpdateBlog";
import WebLayout from "@/components/layouts/WebLayout";
import { getBlogBySlug } from "./action";

const Page = async ({ params }) => {
  const { slug } = await params;

  const currentUser = await getCurrentUser();
  const blog = await getBlogBySlug(slug);

  return (
    <WebLayout>
      <UpdateBlog blog={blog?.data} currentUser={currentUser} />
    </WebLayout>
  );
};

export default Page;
