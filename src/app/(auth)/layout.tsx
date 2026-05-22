export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-grey-soft px-4 py-12">
      {children}
    </div>
  );
}
