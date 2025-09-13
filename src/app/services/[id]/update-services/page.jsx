import { getCurrentUser } from "@/app/action";
import { getServiceById } from "./action";
import UpdateServices from "@/components/services/UpdateServices";
import WebLayout from "@/components/layouts/WebLayout";



const Page = async ({ params }) => {
  const { id } = params;

  const currentUser = await getCurrentUser();
  const serviceResponse = await getServiceById(id);

  if (!serviceResponse.success || !serviceResponse.data) {
    return (
      <WebLayout>
        <p>Service not found.</p>
      </WebLayout>
    );
  }

  const service = serviceResponse.data;

  return (
    <WebLayout>
      <UpdateServices service={service} currentUser={currentUser} />
    </WebLayout>
  );
};

export default Page;
