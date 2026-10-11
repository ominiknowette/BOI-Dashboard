import { Metadata } from "next";
import PortfolioRiskView from "./PortfolioRiskView";

export const metadata: Metadata = {
  title: "Portfolio & Risk",
  description:
    "Prudential asset quality, NPL distribution, capital at risk, and CBN regulatory compliance monitoring.",
};

export default function PortfolioRiskPage() {
  return <PortfolioRiskView />;
}
