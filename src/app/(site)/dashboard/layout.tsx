export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen py-20 bg-gray-50">
      <main>{children}</main>
    </div>
  );
}
