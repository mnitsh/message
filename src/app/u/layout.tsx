
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          "antialiased min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#2C2C2E] via-[#3A3A3C] to-[#1C1C1E]"
        }
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
