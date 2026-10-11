import { Metadata } from "next";
import GeographyView from "./GeographyView";

export const metadata: Metadata = {
  title: "Geographic Allocation",
  description:
    "Sub-national credit deployment, territorial parity, and state-level economic impact across Nigeria's 36 States and the Federal Capital Territory.",
};

export default function GeographyPage() {
  return <GeographyView />;
}
