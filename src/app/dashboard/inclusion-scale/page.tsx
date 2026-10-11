import { Metadata } from "next";
import InclusionScaleView from "./InclusionScaleView";

export const metadata: Metadata = {
  title: "Inclusion & Enterprise Scale",
  description:
    "MSME tier capital allocation, Nano-enterprise coverage, and demographic inclusion metrics across Nigeria.",
};

export default function InclusionScalePage() {
  return <InclusionScaleView />;
}
