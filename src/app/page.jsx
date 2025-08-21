import WebLayout from "@/components/layouts/WebLayout";
import { getCurrentUser } from "./action";
import HomePage from "@/components/home/HomePage";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <WebLayout>
      <h1 className="mb-12 text-2xl">
        Welcome, <span className="font-semibold">{currentUser.name}</span>
      </h1>
      <HomePage />
    </WebLayout>
  );
}
