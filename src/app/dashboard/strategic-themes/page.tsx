import { Metadata } from "next";
import StrategicThemesView from "./StrategicThemesView";

export const metadata: Metadata = {
  title: "Strategic Mandate Themes",
  description:
    "National priorities: Industrialisation, Export Expansion, Youth Employment, Gender Equity, and Green Transition.",
};

export default function StrategicThemesPage() {
  return <StrategicThemesView />;
}
