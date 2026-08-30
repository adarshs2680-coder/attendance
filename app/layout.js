import "./globals.css";

export const metadata = {
  title: "Attendance",
  description: "Attendance tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}