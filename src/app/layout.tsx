import "./globals.css";

export const metadata = {
  title: "Vocab Master",
  description: "Modern English Vocabulary App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* className を指定して Tailwind が反応するようにします */}
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}