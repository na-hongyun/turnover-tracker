"use client";

import { useMemo, useState } from "react";
import type { Product, ProductInput } from "@/domain/entities/Product";
import {
  DEFAULT_LEAD_TIME,
  DEFAULT_SEASONALITY_INDEX,
} from "@/domain/constants/scmConstants";
import { getLastThreeMonthSlots } from "@/domain/services/monthUtils";
import { LogisticsTermLabel } from "@/presentation/components/LogisticsTermTooltip";
import { useLanguage } from "@/presentation/i18n/LanguageContext";

const inputClass =
  "w-full min-w-[150px] rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const labelClass = "mb-2 block text-sm font-medium text-slate-700";

interface ProductFormProps {
  initial?: Product | null;
  onSubmit: (input: ProductInput) => void | Promise<void>;
  onCancel?: () => void;
}

export function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps) {
  const { locale, t } = useLanguage();
  const monthSlots = useMemo(
    () => getLastThreeMonthSlots(new Date(), locale),
    [locale],
  );

  const [barcode, setBarcode] = useState(initial?.barcode ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [currentStock, setCurrentStock] = useState(
    initial?.currentStock?.toString() ?? "0",
  );
  const [shipmentM1, setShipmentM1] = useState(
    String(initial?.shipmentM1 ?? 0),
  );
  const [shipmentM2, setShipmentM2] = useState(
    String(initial?.shipmentM2 ?? 0),
  );
  const [shipmentM3, setShipmentM3] = useState(
    String(initial?.shipmentM3 ?? 0),
  );
  const [seasonalityIndex, setSeasonalityIndex] = useState(
    String(initial?.seasonalityIndex ?? DEFAULT_SEASONALITY_INDEX),
  );
  const [leadTime, setLeadTime] = useState(
    String(initial?.leadTime ?? DEFAULT_LEAD_TIME),
  );
  const [unitPrice, setUnitPrice] = useState(
    String(initial?.unitPrice ?? 0),
  );
  const [error, setError] = useState<string | null>(null);

  const parseNonNegativeInt = (raw: string, label: string): number | null => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n) || n < 0) {
      setError(t.form.nonNegativeInt(label));
      return null;
    }
    return n;
  };

  const parseNonNegativeFloat = (raw: string, label: string): number | null => {
    const n = parseFloat(raw);
    if (Number.isNaN(n) || n < 0) {
      setError(t.form.nonNegativeFloat(label));
      return null;
    }
    return n;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!barcode.trim() || !name.trim()) {
      setError(t.form.requiredFields);
      return;
    }

    const labels = t.form.fieldLabels;
    const stock = parseNonNegativeInt(currentStock, labels.currentStock);
    const m1 = parseNonNegativeInt(shipmentM1, labels.shipmentM1);
    const m2 = parseNonNegativeInt(shipmentM2, labels.shipmentM2);
    const m3 = parseNonNegativeInt(shipmentM3, labels.shipmentM3);
    const season = parseNonNegativeFloat(seasonalityIndex, labels.seasonalityIndex);
    const lead = parseNonNegativeInt(leadTime, labels.leadTime);
    const price = parseNonNegativeInt(unitPrice, labels.unitPrice);

    if (
      stock === null ||
      m1 === null ||
      m2 === null ||
      m3 === null ||
      season === null ||
      lead === null ||
      price === null
    ) {
      return;
    }

    void onSubmit({
      barcode: barcode.trim(),
      name: name.trim(),
      currentStock: stock,
      shipmentM1: m1,
      shipmentM2: m2,
      shipmentM3: m3,
      seasonalityIndex: season,
      leadTime: lead,
      unitPrice: price,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        {initial ? t.form.editTitle : t.form.createTitle}
      </h2>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className={labelClass}>{t.form.barcode}</label>
          <input
            required
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-5">
          <label className={labelClass}>{t.form.productName}</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <label className={labelClass}>{t.form.currentStock}</label>
          <input
            type="number"
            min={0}
            required
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <label className={labelClass}>{t.form.unitPrice}</label>
          <input
            type="number"
            min={0}
            required
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-3">
          <div className={labelClass}>
            <LogisticsTermLabel
              term="seasonalityIndex"
              displayTitle={t.form.seasonalityIndex}
            />
          </div>
          <input
            type="number"
            min={0}
            step={0.01}
            required
            value={seasonalityIndex}
            onChange={(e) => setSeasonalityIndex(e.target.value)}
            className={inputClass}
            placeholder={t.form.seasonalityPlaceholder}
          />
        </div>
        <div className="md:col-span-3">
          <div className={labelClass}>
            <LogisticsTermLabel
              term="leadTime"
              displayTitle={t.form.leadTimeDays}
            />
          </div>
          <input
            type="number"
            min={0}
            required
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="mt-8 border-t border-slate-100 pt-8">
        <legend className="mb-6 px-1">
          <LogisticsTermLabel
            term="recentShipments"
            displayTitle={t.form.recentShipmentsLegend}
            titleClassName="text-sm font-semibold text-slate-800"
          />
        </legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              label: `M1 (${monthSlots[0]?.label})`,
              value: shipmentM1,
              set: setShipmentM1,
            },
            {
              label: `M2 (${monthSlots[1]?.label})`,
              value: shipmentM2,
              set: setShipmentM2,
            },
            {
              label: `M3 (${monthSlots[2]?.label})`,
              value: shipmentM3,
              set: setShipmentM3,
            },
          ].map((field) => (
            <div key={field.label} className="min-w-[150px]">
              <label className={labelClass}>{field.label}</label>
              <input
                type="number"
                min={0}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          {initial ? t.form.submitSave : t.form.submitCreate}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t.form.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
