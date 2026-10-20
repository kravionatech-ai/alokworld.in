export const metadata = {
  title: "Samaj Community Directory | समाज डिरेक्टरी",
  description: "Connect, discover and network with verified community members across cities and professions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased bg-gray-50/50">
      <body className="min-h-full flex flex-col text-gray-900 bg-gray-50/50">
        {children}
      </body>
    </html>
  );
}
