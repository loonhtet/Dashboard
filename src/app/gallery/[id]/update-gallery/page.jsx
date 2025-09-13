import { getCurrentUser } from "@/app/action";
import { getAllServices, getGalleryById } from "./action";
import WebLayout from "@/components/layouts/WebLayout";
import UpdateGallery from "@/components/gallery/UpdateGallery";

const Page = async ({ params }) => {
  const { id } = await params;

  const currentUser = await getCurrentUser();
  const gallery = await getGalleryById(id);
  const { success, data: services } = await getAllServices();

  const formattedServices =
    success && services
      ? services.map((s) => ({
          id: s.id,
          name: s.title,
        }))
      : [];

  return (
    <WebLayout>
      <UpdateGallery
        gallery={gallery?.data}
        currentUser={currentUser}
        services={formattedServices}
      />
    </WebLayout>
  );
};

export default Page;
