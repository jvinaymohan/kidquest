import { useParams } from "react-router-dom";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { getFactsForTable } from "../data/multiplication/tables";

export function useMultiplication() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn) || 1;
  const table = useMultiplicationStore((s) => s.tables[tableNumber]);
  const unlockAll = useMultiplicationStore((s) => s.unlockAllTables);
  const progress = useMultiplicationStore((s) => s.getTableProgress(tableNumber));
  const facts = getFactsForTable(tableNumber);

  const unlocked = unlockAll || table?.unlocked;
  const phase = table?.legendAt ? 5 : table?.currentPhase ?? 1;

  return { tableNumber, table, facts, unlocked, phase, progress };
}
