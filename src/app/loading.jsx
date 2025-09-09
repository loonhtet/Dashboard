import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <Loader2 className="mx-auto animate-spin" />
    </div>
  );
};

export default Loading;
