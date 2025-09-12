import { getCurrentUser } from "@/app/action";
import UpdateGallery from "@/components/gallery/UpdateGallery";
import WebLayout from "@/components/layouts/WebLayout";
import { getGalleryById } from "./[id]/update-gallery/action";


const Page = async ({ params }) => {
  const { id } = params; // matches folder name [id]

  const currentUser = await getCurrentUser();
  const gallery = await getGalleryById(id);

  return (
    <WebLayout>
      <UpdateGallery gallery={gallery?.data} currentUser={currentUser} />
    </WebLayout>
  );
};

export default Page;
