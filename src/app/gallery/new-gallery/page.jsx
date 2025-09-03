import { getCurrentUser } from "@/app/action";
import NewGallery from "@/components/gallery/NewGallery";
import WebLayout from "@/components/layouts/WebLayout";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <NewGallery currentUser={currentUser} />
    </WebLayout>
  );
};

export default page;
