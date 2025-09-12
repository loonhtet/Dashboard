import { getCurrentUser } from "@/app/action";
import UpdateGallery from "@/components/gallery/UpdateGallery";
import WebLayout from "@/components/layouts/WebLayout";
import { getGalleryById } from "./action";

const Page = async ({ params }) => {
  const { slug } = params; // no need for await

  const currentUser = await getCurrentUser();
  const gallery = await getGalleryById(slug);

  return (
    <WebLayout>
      <UpdateGallery gallery={gallery?.data} currentUser={currentUser} />
    </WebLayout>
  );
};

export default Page;
