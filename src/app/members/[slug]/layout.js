import { generateMetadata as baseGenerateMetadata } from "@/app/member/[id]/layout";

export async function generateMetadata({ params }) {
  return baseGenerateMetadata({ params });
}

export default function MembersSlugLayout({ children }) {
  return children;
}
