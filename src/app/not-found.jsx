import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-xl p-8 text-center shadow-lg">
        <CardContent className="space-y-6">
          <h2 className="text-5xl font-semibold">Page Not Found</h2>
          <p className="">Oops! The page you’re looking for doesn’t exist.</p>
          <Link href="/">
            <Button variant="default">Go Back Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
