"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { IndianRupee, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";

export function BuyCourseButton({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/${courseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe Checkout page
        router.push(data);
      } else {
        const error = await response.json();
        console.error("Checkout error:", error);
      }
    } catch (err) {
      console.error("Error initiating checkout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleCheckout}
        variant={"white"}
        className={cn("rounded-[2px]")}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div>
            <IndianRupee />
            Buy course
          </div>
        )}
      </Button>
    </div>
  );
}
