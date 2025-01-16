import Image from "next/image";
import { IconButton } from "~/app/_components/controls/Buttons";

import branddiscord from "~/assets/images/branddiscord.png";

const getOAuthIcon = (id: string) => {
  switch (id) {
    case "discord":
      return (
        <Image src={branddiscord} alt="discord-login" width={24} height={24} />
      );
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
