import { TableCard } from "./TableCard";

export function TableGrid() {
  const tables = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {tables.map((n) => (
        <TableCard key={n} tableNumber={n} />
      ))}
    </div>
  );
}
