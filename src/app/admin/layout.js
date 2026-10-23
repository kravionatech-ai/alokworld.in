export const metadata = {
  title: "Admin Control Center | alokworld.in",
  description: "Secure Administrative CMS Control Panel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }) {
  return <div lang="en">{children}</div>;
}
