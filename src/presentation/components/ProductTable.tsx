"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { AbcGrade, ProductWithMetrics, StockStatus } from "@/domain/entities/Product";
import { getLastThreeMonthSlots } from "@/domain/services/monthUtils";
import { AbcBadge } from "@/presentation/components/AbcBadge";
import { StockStatusBadge } from "@/presentation/components/StockStatusBadge";
import { LogisticsTermLabel } from "@/presentation/components/LogisticsTermTooltip";
import { useLanguage } from "@/presentation/i18n/LanguageContext";

interface ProductTableProps {
  products: ProductWithMetrics[];
  onEdit: (product: ProductWithMetrics) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 50] as const;
const DEFAULT_PAGE_SIZE = 10;
const SCROLL_ROW_THRESHOLD = 10;

type SortField =
  | "abcGrade"
  | "barcode"
  | "name"
  | "unitPrice"
  | "currentStock"
  | "adjustedDailyShipment"
  | "turnoverDays"
  | "stockStatus";

type SortDirection = "asc" | "desc";

interface SortState {
  field: SortField | null;
  direction: SortDirection | null;
}

const ABC_ORDER: Record<AbcGrade, number> = { A: 0, B: 1, C: 2 };
const STATUS_ORDER: Record<StockStatus, number> = {
  danger: 0,
  normal: 1,
  warning: 2,
};

const ROW_BG: Record<StockStatus, string> = {
  danger: "bg-red-50/70 hover:bg-red-50",
  normal: "bg-white hover:bg-slate-50/80",
  warning: "bg-amber-50/50 hover:bg-amber-50",
};

const thClass =
  "whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-600";
const tdClass = "whitespace-nowrap px-4 py-3.5 text-sm";

function compareProducts(
  a: ProductWithMetrics,
  b: ProductWithMetrics,
  field: SortField,
  direction: SortDirection,
  locale: "ko" | "ja",
): number {
  let cmp = 0;
  switch (field) {
    case "abcGrade":
      cmp = ABC_ORDER[a.abcGrade] - ABC_ORDER[b.abcGrade];
      break;
    case "barcode":
      cmp = a.barcode.localeCompare(b.barcode, locale);
      break;
    case "name":
      cmp = a.name.localeCompare(b.name, locale);
      break;
    case "unitPrice":
      cmp = a.unitPrice - b.unitPrice;
      break;
    case "currentStock":
      cmp = a.currentStock - b.currentStock;
      break;
    case "adjustedDailyShipment":
      cmp = a.adjustedDailyShipment - b.adjustedDailyShipment;
      break;
    case "turnoverDays":
      cmp = a.turnoverDays - b.turnoverDays;
      break;
    case "stockStatus":
      cmp = STATUS_ORDER[a.stockStatus] - STATUS_ORDER[b.stockStatus];
      break;
  }
  return direction === "asc" ? cmp : -cmp;
}

function SortIcon({
  field,
  sort,
}: {
  field: SortField;
  sort: SortState;
}) {
  const active = sort.field === field;
  const dir = active ? sort.direction : null;
  const base = active ? "text-blue-600" : "text-slate-300";

  return (
    <span
      className={`inline-flex shrink-0 flex-col items-center justify-center gap-px ${base}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 10 6"
        className={`h-1.5 w-2 ${dir === "asc" ? "text-blue-600" : "text-slate-300"}`}
        fill="currentColor"
      >
        <path d="M5 0L10 6H0z" />
      </svg>
      <svg
        viewBox="0 0 10 6"
        className={`h-1.5 w-2 ${dir === "desc" ? "text-blue-600" : "text-slate-300"}`}
        fill="currentColor"
      >
        <path d="M5 6L0 0h10z" />
      </svg>
    </span>
  );
}

function sortKeyHandler(
  onSort: (field: SortField) => void,
  field: SortField,
): (e: KeyboardEvent) => void {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSort(field);
    }
  };
}

/** button 대신 div[role=button] — 툴팁 등 내부 interactive 요소와 중첩 방지 */
function SortableThTrigger({
  field,
  label,
  align,
  sort,
  onSort,
  children,
  className = "",
  sortAriaLabel,
}: {
  field: SortField;
  label: string;
  align: "left" | "right" | "center";
  sort: SortState;
  onSort: (field: SortField) => void;
  children?: ReactNode;
  className?: string;
  sortAriaLabel: string;
}) {
  const wrapperClass =
    align === "right"
      ? "ml-auto"
      : align === "center"
        ? "mx-auto"
        : "";

  return (
    <div className={wrapperClass}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSort(field)}
        onKeyDown={sortKeyHandler(onSort, field)}
        className={`inline-flex cursor-pointer items-center gap-1.5 transition hover:text-blue-600 ${className}`}
        aria-label={sortAriaLabel}
      >
        <span className="inline-flex items-center">
          {children ?? <span>{label}</span>}
        </span>
        <SortIcon field={field} sort={sort} />
      </div>
    </div>
  );
}

function SortableHeader({
  field,
  label,
  align,
  sort,
  onSort,
  children,
  sortAriaLabel,
}: {
  field: SortField;
  label: string;
  align: "left" | "right" | "center";
  sort: SortState;
  onSort: (field: SortField) => void;
  children?: ReactNode;
  sortAriaLabel: string;
}) {
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  return (
    <th className={`${thClass} bg-slate-50 ${alignClass}`}>
      <SortableThTrigger
        field={field}
        label={label}
        align={align}
        sort={sort}
        onSort={onSort}
        sortAriaLabel={sortAriaLabel}
      >
        {children}
      </SortableThTrigger>
    </th>
  );
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { locale, t } = useLanguage();
  const monthSlots = useMemo(
    () => getLastThreeMonthSlots(new Date(), locale),
    [locale],
  );
  const shipmentKeys = ["shipmentM1", "shipmentM2", "shipmentM3"] as const;

  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ field: null, direction: null });

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, products.length]);

  const sortedProducts = useMemo(() => {
    if (!sort.field || !sort.direction) return products;
    return [...products].sort((a, b) =>
      compareProducts(a, b, sort.field!, sort.direction!, locale),
    );
  }, [products, sort, locale]);

  const totalCount = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, safePage, pageSize]);

  const rangeStart = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalCount);
  const enableBodyScroll = paginatedProducts.length > SCROLL_ROW_THRESHOLD;

  const handleSort = (field: SortField) => {
    setCurrentPage(1);
    setSort((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };

  if (products.length === 0) {
    return (
      <div className="w-full rounded-xl border border-dashed border-slate-200 bg-white px-8 py-20 text-center text-slate-500">
        {t.table.empty}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <div
          className={
            enableBodyScroll ? "max-h-[500px] overflow-y-auto" : "overflow-y-visible"
          }
        >
          <table className="w-full min-w-[1400px] table-auto border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-slate-50 shadow-[0_1px_0_0_rgb(226,232,240)]">
              <tr className="border-b border-slate-100">
                <th className="bg-slate-50 px-4 py-2" colSpan={5} />
                <th
                  className="bg-slate-50 px-4 py-2 text-center"
                  colSpan={3}
                >
                  <LogisticsTermLabel
                    term="recentShipments"
                    titleClassName="text-xs font-semibold uppercase tracking-wide text-slate-600"
                  />
                </th>
                <th className="bg-slate-50 px-4 py-2" colSpan={4} />
              </tr>
              <tr className="border-b border-slate-200">
                <SortableHeader
                  field="abcGrade"
                  label={t.table.abc}
                  align="center"
                  sort={sort}
                  onSort={handleSort}
                  sortAriaLabel={t.table.sortBy(t.table.abc)}
                />
                <SortableHeader
                  field="barcode"
                  label={t.table.barcode}
                  align="left"
                  sort={sort}
                  onSort={handleSort}
                  sortAriaLabel={t.table.sortBy(t.table.barcode)}
                />
                <SortableHeader
                  field="name"
                  label={t.table.productName}
                  align="left"
                  sort={sort}
                  onSort={handleSort}
                  sortAriaLabel={t.table.sortBy(t.table.productName)}
                />
                <SortableHeader
                  field="unitPrice"
                  label={t.table.unitPrice}
                  align="right"
                  sort={sort}
                  onSort={handleSort}
                  sortAriaLabel={t.table.sortBy(t.table.unitPrice)}
                />
                <SortableHeader
                  field="currentStock"
                  label={t.table.currentStock}
                  align="right"
                  sort={sort}
                  onSort={handleSort}
                  sortAriaLabel={t.table.sortBy(t.table.currentStock)}
                />
                {monthSlots.map((slot, i) => (
                  <th
                    key={slot.monthKey}
                    className={`${thClass} bg-slate-50 text-right`}
                  >
                    M{i + 1} ({slot.label})
                  </th>
                ))}
                <SortableHeader
                  field="adjustedDailyShipment"
                  label={t.table.adjustedDailyShipment}
                  align="right"
                  sort={sort}
                  onSort={handleSort}
                  sortAriaLabel={t.table.sortBy(t.table.adjustedDailyShipment)}
                />
                <th className={`${thClass} bg-slate-50 text-right`}>
                  <SortableThTrigger
                    field="turnoverDays"
                    label={t.table.turnoverDays}
                    align="right"
                    sort={sort}
                    onSort={handleSort}
                    sortAriaLabel={t.table.sortBy(t.table.turnoverDays)}
                  >
                    <LogisticsTermLabel
                      term="turnoverDays"
                      displayTitle={t.table.turnoverDays}
                      titleClassName="text-xs font-semibold uppercase tracking-wide text-slate-600"
                    />
                  </SortableThTrigger>
                </th>
                <th className={`${thClass} min-w-[200px] bg-slate-50 text-center`}>
                  <div className="mx-auto inline-flex flex-col items-center gap-1">
                    <SortableThTrigger
                      field="stockStatus"
                      label={t.table.stockStatus}
                      align="center"
                      sort={sort}
                      onSort={handleSort}
                      sortAriaLabel={t.table.sortBy(t.table.stockStatus)}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t.table.stockStatus}
                      </span>
                    </SortableThTrigger>
                    <LogisticsTermLabel
                      term="suggestedOrderQty"
                      displayTitle={t.table.suggestedOrderQty}
                      titleClassName="text-[10px] font-medium normal-case text-slate-500"
                    />
                  </div>
                </th>
                <th className={`${thClass} bg-slate-50 text-center`}>
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`${ROW_BG[product.stockStatus]} ${
                    product.abcGrade === "A"
                      ? "ring-1 ring-inset ring-violet-200"
                      : ""
                  }`}
                >
                  <td className={`${tdClass} text-center`}>
                    <AbcBadge grade={product.abcGrade} />
                  </td>
                  <td className={`${tdClass} font-mono text-xs text-slate-600`}>
                    {product.barcode}
                  </td>
                  <td className={`${tdClass} font-medium text-slate-900`}>
                    <span className="inline-flex items-center gap-2">
                      {product.name}
                      {product.abcGrade === "A" && (
                        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                          {t.table.coreProduct}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right tabular-nums text-slate-600`}>
                    {t.table.currency(product.unitPrice)}
                  </td>
                  <td className={`${tdClass} text-right tabular-nums text-slate-800`}>
                    {product.currentStock.toLocaleString()}
                  </td>
                  {shipmentKeys.map((key) => (
                    <td
                      key={key}
                      className={`${tdClass} text-right tabular-nums text-slate-600`}
                    >
                      {product[key].toLocaleString()}
                    </td>
                  ))}
                  <td className={`${tdClass} text-right tabular-nums text-slate-700`}>
                    {product.adjustedDailyShipment.toFixed(2)}
                  </td>
                  <td
                    className={`${tdClass} text-right text-base font-semibold tabular-nums text-slate-900`}
                  >
                    {t.table.turnoverDaysValue(product.turnoverDays)}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <StockStatusBadge
                      status={product.stockStatus}
                      suggestedOrderQty={product.suggestedOrderQty}
                    />
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <div className="inline-flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        {t.table.viewDetail}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        {t.table.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <label
            htmlFor="page-size-select"
            className="text-sm font-medium text-slate-600"
          >
            {t.table.pageSizeLabel}
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {t.table.pageSizeOption(size)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>
            {t.table.paginationRange(rangeStart, rangeEnd, totalCount)}
            {t.table.paginationOrdinal && (
              <>
                {" "}
                {t.table.paginationOrdinal}
              </>
            )}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium disabled:opacity-40 hover:bg-white"
              >
                {t.table.previous}
              </button>
              <span className="tabular-nums text-slate-500">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium disabled:opacity-40 hover:bg-white"
              >
                {t.table.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
