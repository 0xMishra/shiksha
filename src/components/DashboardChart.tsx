import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function DashboardChart({ data, text }: { data: string; text: string }) {
  return (
    <Card
      className="m-2 w-[300px] cursor-pointer hover:bg-[#1d2021] lg:w-[270px]"
      style={{ background: "#171717", color: "white", marginTop: "2rem" }}
    >
      <CardHeader>
        <CardTitle className="text-4xl">{data}</CardTitle>
        <CardDescription className="text-lg">{text}</CardDescription>
      </CardHeader>
    </Card>
  );
}
