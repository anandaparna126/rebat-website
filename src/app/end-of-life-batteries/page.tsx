import { ValueChainPage } from "@/components/valuechain/ValueChainPage";
import { VALUE_CHAIN_SOURCES } from "@/lib/content";

export default function EndOfLifeBatteries() {
  return <ValueChainPage source={VALUE_CHAIN_SOURCES.find((s) => s.id === "end-of-life-batteries")!} />;
}
