import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "../action";
import GalleryHome from "@/components/gallery/GalleryHome";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <GalleryHome currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
