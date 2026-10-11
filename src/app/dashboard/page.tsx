import { Metadata } from "next";
import DashboardView from "./DashboardView";

export const metadata: Metadata = {
  title: "Impact Dashboard",
  description:
    "Executive Overview of National Impact Metrics, Disbursements, Job Creation, and Risk Distribution across Nigeria.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
