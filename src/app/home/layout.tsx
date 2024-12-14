import MainLayout from "../_components/layouts/MainLayout";

export default function Home({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MainLayout>{children}</MainLayout>;
}
