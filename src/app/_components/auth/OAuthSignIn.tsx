import { IconButton } from "~/app/_components/controls/Buttons";

import { IconBrandDiscord } from "@tabler/icons-react";

const getOAuthIcon = (id: string) => {
  switch (id) {
    case "discord":
      return <IconBrandDiscord />;
    default:
      return null;
  }
};

export default function OAuthSignIn({ id }: { id: string }) {
  return (
    <IconButton
      type="submit"
      className="h-10 w-10 rounded-2xl border-2 border-black"
      icon={getOAuthIcon(id)}
    />
  );
}
