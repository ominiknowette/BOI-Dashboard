import { Metadata } from "next";
import SectorsView from "./SectorsView";

export const metadata: Metadata = {
  title: "Real-Sector Allocation",
  description:
    "Real-sector capital deployment, job generation elasticity, and enterprise coverage across 10 strategic industrial sectors.",
};

export default function SectorsPage() {
  return <SectorsView />;
}
