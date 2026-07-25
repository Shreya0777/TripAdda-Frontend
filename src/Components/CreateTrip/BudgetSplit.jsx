import Input from "../common/Input";

// FIX (#2 from the review): the original form asked for five separate
// exact numbers (stay/food/transport/sightseeing/other cost) that most
// travelers never tracked that precisely — a real recall barrier, not
// just a UI annoyance. This adds an "I don't have exact numbers" mode:
// pick the rough shape of where the money went, and the split is
// estimated from the total budget. Anyone who *does* have exact figures
// can switch to "Exact numbers" and enter them directly, same as before.
export const BUDGET_PRESETS = {
  mostly_stay: { label: "Mostly went on stay", stay: 0.45, food: 0.2, transport: 0.2, sightseeing: 0.1, other: 0.05 },
  mostly_food: { label: "Mostly went on food", stay: 0.2, food: 0.45, transport: 0.2, sightseeing: 0.1, other: 0.05 },
  even: { label: "Roughly even across everything", stay: 0.3, food: 0.25, transport: 0.25, sightseeing: 0.12, other: 0.08 },
};

export function estimateCosts(totalBudget, presetKey) {
  const preset = BUDGET_PRESETS[presetKey] || BUDGET_PRESETS.even;
  const total = Number(totalBudget) || 0;
  return {
    stayCost: Math.round(total * preset.stay),
    foodCost: Math.round(total * preset.food),
    transportCost: Math.round(total * preset.transport),
    sightseeingCost: Math.round(total * preset.sightseeing),
    otherCost: Math.round(total * preset.other),
  };
}

const BudgetSplit = ({ form, budgetMode, setBudgetMode, budgetPreset, setBudgetPreset, onChange }) => {
  return (
    <div>
      <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setBudgetMode("estimate")}
          className={`flex-1 rounded-lg py-2 font-medium transition ${
            budgetMode === "estimate" ? "bg-white shadow text-blue-700" : "text-gray-500"
          }`}
        >
          I don't have exact numbers
        </button>
        <button
          type="button"
          onClick={() => setBudgetMode("exact")}
          className={`flex-1 rounded-lg py-2 font-medium transition ${
            budgetMode === "exact" ? "bg-white shadow text-blue-700" : "text-gray-500"
          }`}
        >
          I know exact numbers
        </button>
      </div>

      {budgetMode === "estimate" ? (
        <div className="space-y-3">
          {Object.entries(BUDGET_PRESETS).map(([key, preset]) => {
            const estimated = estimateCosts(form.totalBudget, key);
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm transition ${
                  budgetPreset === key ? "border-blue-500 bg-blue-50" : "border-borderMain"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="budgetPreset"
                    checked={budgetPreset === key}
                    onChange={() => setBudgetPreset(key)}
                  />
                  {preset.label}
                </span>
                {form.totalBudget ? (
                  <span className="text-xs text-gray-400">
                    Stay ~{estimated.stayCost} · Food ~{estimated.foodCost} · Transport ~{estimated.transportCost}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Enter total budget first</span>
                )}
              </label>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Input label="Stay Cost" name="stayCost" type="number" value={form.stayCost} onChange={onChange} />
          <Input label="Food Cost" name="foodCost" type="number" value={form.foodCost} onChange={onChange} />
          <Input label="Transport Cost" name="transportCost" type="number" value={form.transportCost} onChange={onChange} />
          <Input label="Sightseeing Cost" name="sightseeingCost" type="number" value={form.sightseeingCost} onChange={onChange} />
          <Input label="Other Cost" name="otherCost" type="number" value={form.otherCost} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default BudgetSplit;