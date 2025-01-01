"use client";
import axios from "axios";
import { IndianRupee, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function BuyCourseButton({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/${courseId}/checkout`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        window.location.assign(response.data);
      } else {
        console.error("Checkout error");
      }
    } catch (err) {
      console.error("Error initiating checkout:", err);
      toast({
        variant: "destructive",
        title: "something went wrong",
      });
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
          <div className="flex items-center justify-center space-x-2">
            <IndianRupee />
            Buy course
          </div>
        )}
      </Button>
    </div>
  );
}
