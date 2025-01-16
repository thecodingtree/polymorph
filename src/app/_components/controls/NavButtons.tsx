// import { useRouter } from 'next/navigation';

import { IconButton } from "./Buttons";

import { ArrowLeft } from "lucide-react";

export function BackButton() {
  //const router = useRouter();
  return <IconButton icon={<ArrowLeft />} />;
}
