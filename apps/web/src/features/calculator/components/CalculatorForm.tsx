import { useMemo, useState } from 'react';
import {
  addOnOptions,
  defaultCalculatorInput,
  seatingStyleOptions,
  tentTypeOptions,
  type CalculatorAddOnKey,
  type CalculatorInput,
} from '../contracts';
import { useCalculateMutation } from '../hooks/useCalculateMutation';

function toggleAddOn(addOns: CalculatorAddOnKey[], addOn: CalculatorAddOnKey): CalculatorAddOnKey[] {
  return addOns.includes(addOn) ? addOns.filter((item) => item !== addOn) : [...addOns, addOn];
}

export function CalculatorForm() {
  const [form, setForm] = useState<CalculatorInput>(defaultCalculatorInput);
  const [tenantId, setTenantId] = useState('');
  const mutation = useCalculateMutation(tenantId || undefined);

  const sortedAddOns = useMemo(() => [...addOnOptions].sort(), []);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 p-6 md:grid-cols-2">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold text-white">Tent Calculator</h1>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate(form);
          }}
        >
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Tenant ID (optional)</span>
            <input
              value={tenantId}
              onChange={(event) => setTenantId(event.target.value)}
              placeholder="tenant-a"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Guest Count</span>
            <input
              type="number"
              min={1}
              value={form.guestCount}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  guestCount: Number(event.target.value) || 1,
                }))
              }
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Seating Style</span>
            <select
              value={form.seatingStyle}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  seatingStyle: event.target.value as CalculatorInput['seatingStyle'],
                }))
              }
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
            >
              {seatingStyleOptions.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Tent Type</span>
            <select
              value={form.tentType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tentType: event.target.value as CalculatorInput['tentType'],
                }))
              }
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
            >
              {tentTypeOptions.map((tentType) => (
                <option key={tentType} value={tentType}>
                  {tentType}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="mb-1 text-sm text-slate-300">Add-ons</legend>
            <div className="grid grid-cols-2 gap-2">
              {sortedAddOns.map((addOn) => (
                <label key={addOn} className="flex items-center gap-2 rounded-md border border-slate-800 p-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.addOns.includes(addOn)}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        addOns: toggleAddOn(prev.addOns, addOn),
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  />
                  <span>{addOn}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? 'Calculating...' : 'Calculate Tent'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-white">Result</h2>
        {mutation.isError ? (
          <p className="rounded-md border border-rose-800 bg-rose-900/30 p-3 text-sm text-rose-200">
            {(mutation.error as Error).message}
          </p>
        ) : null}
        {mutation.data ? (
          <dl className="grid grid-cols-2 gap-y-3 text-sm text-slate-200">
            <dt className="text-slate-400">Required SqFt</dt>
            <dd>{mutation.data.requiredSqFt}</dd>
            <dt className="text-slate-400">Tent Width</dt>
            <dd>{mutation.data.recommendedTentSize.width}</dd>
            <dt className="text-slate-400">Tent Length</dt>
            <dd>{mutation.data.recommendedTentSize.length}</dd>
            <dt className="text-slate-400">Tent Area</dt>
            <dd>{mutation.data.recommendedTentSize.area}</dd>
            <dt className="text-slate-400">Tables</dt>
            <dd>{mutation.data.tables}</dd>
            <dt className="text-slate-400">Chairs</dt>
            <dd>{mutation.data.chairs}</dd>
            <dt className="text-slate-400">Geometry</dt>
            <dd>
              {mutation.data.geometry.width} x {mutation.data.geometry.length}
            </dd>
          </dl>
        ) : (
          <p className="text-sm text-slate-400">Submit the form to see calculated output from `POST /v1/calculate`.</p>
        )}
      </section>
    </div>
  );
}
