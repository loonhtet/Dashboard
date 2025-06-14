import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "./action";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <h1 className="text-2xl">
        Welcome, <span className="font-semibold">{currentUser.name}</span>
      </h1>
    </WebLayout>
  );
}
