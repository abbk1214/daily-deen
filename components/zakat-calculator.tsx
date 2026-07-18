"use client";

import { useState, useMemo } from "react";
import { Calculator, Info } from "lucide-react";

interface ZakatItem {
  category: string;
  label: string;
  amount: number;
  isWealth: boolean; // true = adds to wealth, false = subtracts (debts)
}

interface ZakatResult {
  totalWealth: number;
  totalDebts: number;
  nisabThreshold: number;
  zakatDue: number;
  isEligible: boolean;
  breakdown: { category: string; amount: number }[];
}

const ZAKAT_CATEGORIES: Omit<ZakatItem, "amount">[] = [
  // Wealth categories
  { category: "cash", label: "Cash (savings, checking)", isWealth: true },
  { category: "cash", label: "Cash at home", isWealth: true },
  { category: "gold", label: "Gold", isWealth: true },
  { category: "silver", label: "Silver", isWealth: true },
  { category: "stocks", label: "Stocks & investments", isWealth: true },
  { category: "business", label: "Business inventory", isWealth: true },
  { category: "receivables", label: "Money owed to you", isWealth: true },
  { category: "property", label: "Investment property", isWealth: true },
  { category: "other", label: "Other wealth", isWealth: true },
  // Debt categories
  { category: "debts", label: "Debts you owe", isWealth: false },
  { category: "bills", label: "Bills & expenses due", isWealth: false },
];

// Nisab thresholds (approximate, based on gold/silver)
// Gold: 85g × ~$65/g = ~$5,525
// Silver: 595g × ~$0.80/g = ~$476
// We use the more commonly accepted gold nisab
const NISAB_GOLD_GRAMS = 85;
const GOLD_PRICE_PER_GRAM = 65; // Approximate USD
const NISAB_THRESHOLD = NISAB_GOLD_GRAMS * GOLD_PRICE_PER_GRAM;
const ZAKAT_RATE = 0.025; // 2.5%

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ZakatCalculator() {
  const [items, setItems] = useState<ZakatItem[]>(
    ZAKAT_CATEGORIES.map((cat) => ({ ...cat, amount: 0 })),
  );
  const [showInfo, setShowInfo] = useState(false);

  const updateAmount = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, amount: numValue } : item)),
    );
  };

  const result: ZakatResult = useMemo(() => {
    const wealthItems = items.filter((i) => i.isWealth && i.amount > 0);
    const debtItems = items.filter((i) => !i.isWealth && i.amount > 0);

    const totalWealth = wealthItems.reduce((sum, i) => sum + i.amount, 0);
    const totalDebts = debtItems.reduce((sum, i) => sum + i.amount, 0);
    const netWealth = totalWealth - totalDebts;
    const isEligible = netWealth >= NISAB_THRESHOLD;
    const zakatDue = isEligible ? netWealth * ZAKAT_RATE : 0;

    return {
      totalWealth,
      totalDebts,
      nisabThreshold: NISAB_THRESHOLD,
      zakatDue,
      isEligible,
      breakdown: [
        ...wealthItems.map((i) => ({ category: i.label, amount: i.amount })),
        ...debtItems.map((i) => ({ category: i.label, amount: -i.amount })),
      ],
    };
  }, [items]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator size={18} className="text-dusk-teal" />
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Zakat Calculator
          </p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info size={16} />
        </button>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="mb-4 p-3 rounded-xl bg-muted/50 border border-border">
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Zakat Rules
          </p>
          <ul className="mt-1 space-y-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            <li>• 2.5% of wealth above Nisab threshold</li>
            <li>• Nisab ≈ {formatCurrency(NISAB_THRESHOLD)} (85g gold)</li>
            <li>• Wealth held for 1 lunar year (Hawl)</li>
            <li>• Debts are subtracted from total wealth</li>
          </ul>
        </div>
      )}

      {/* Wealth inputs */}
      <div className="space-y-3 mb-4">
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Wealth
        </p>
        {items
          .filter((i) => i.isWealth)
          .map((item, idx) => {
            const realIndex = items.indexOf(item);
            return (
              <div key={idx} className="flex items-center gap-3">
                <label
                  className="flex-1 text-foreground"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  {item.label}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={item.amount || ""}
                  onChange={(e) => updateAmount(realIndex, e.target.value)}
                  placeholder="$0"
                  className="w-28 text-right rounded-lg border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontSize: "var(--text-body-sm)" }}
                />
              </div>
            );
          })}
      </div>

      {/* Debt inputs */}
      <div className="space-y-3 mb-4">
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Debts
        </p>
        {items
          .filter((i) => !i.isWealth)
          .map((item, idx) => {
            const realIndex = items.indexOf(item);
            return (
              <div key={idx} className="flex items-center gap-3">
                <label
                  className="flex-1 text-foreground"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  {item.label}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={item.amount || ""}
                  onChange={(e) => updateAmount(realIndex, e.target.value)}
                  placeholder="$0"
                  className="w-28 text-right rounded-lg border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontSize: "var(--text-body-sm)" }}
                />
              </div>
            );
          })}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border p-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>Total Wealth</span>
          <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            {formatCurrency(result.totalWealth)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>Total Debts</span>
          <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            -{formatCurrency(result.totalDebts)}
          </span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between">
          <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>
            Zakat Due (2.5%)
          </span>
          <span
            style={{
              fontSize: "var(--text-body)",
              fontWeight: 700,
              color: result.zakatDue > 0 ? "var(--dawn-coral)" : "var(--dusk-teal)",
            }}
          >
            {formatCurrency(result.zakatDue)}
          </span>
        </div>
        {!result.isEligible && result.totalWealth > 0 && (
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            Below Nisab threshold ({formatCurrency(NISAB_THRESHOLD)})
          </p>
        )}
      </div>
    </div>
  );
}
