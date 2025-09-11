import { getCurrentUser } from "@/app/action";
import { getAllServices } from "@/app/services/action";
import NewGallery from "@/components/gallery/NewGallery";
import WebLayout from "@/components/layouts/WebLayout";

const page = async () => {
  const currentUser = await getCurrentUser();
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
      <NewGallery currentUser={currentUser} services={formattedServices} />
    </WebLayout>
  );
};

export default page;
