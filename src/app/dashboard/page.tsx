import { api } from "~/trpc/server";

export default async function Dashboard() {
  const data = await api.post.hello({ text: "dashboard" });

  return <>{data.greeting}</>;
}
