import "./globals.css";

export const metadata = {
  title: "Website Under Maintenance",
  description: "We are working to improve your experience. Please visit us again soon.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
