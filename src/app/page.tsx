import CertumAILandingPage from "@/components/CertumAILandingPage";
import { Metadata } from "next";
import { SoftwareApplicationSchema, FAQSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://certumai.xyz',
  },
};

export default function HomePage() {
  return (
    <>
      <SoftwareApplicationSchema />
      <FAQSchema />
      <CertumAILandingPage />
    </>
  );
}
