import { api } from "~/trpc/server";

type Props = {
  readonly params: {
    readonly postId: string;
  };
};

export default async function Dashboard({ params: { postId } }: Props) {
  const data = await api.post.hello({ text: postId });

  return <>{data.greeting}</>;
}
