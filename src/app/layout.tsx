import "./globals.css";

export const metadata = {
  title: "Vocab Master",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* 直接 style を書いて、Tailwindが効かない時のバックアップをします */}
      <body className="bg-gray-50" style={{ backgroundColor: '#f9fafb', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}