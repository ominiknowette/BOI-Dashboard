import { Metadata } from "next";
import AskBOIAIView from "./AskBOIAIView";

export const metadata: Metadata = {
  title: "Ask BOI AI",
  description:
    "Interactive development finance AI analyst — Deterministic query parsing, evidence retrieval, and executive synthesis.",
};

export default function AskBOIAIPage() {
  return <AskBOIAIView />;
}
