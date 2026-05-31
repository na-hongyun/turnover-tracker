"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductInput, ProductWithMetrics } from "@/domain/entities/Product";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/productApi";
import { LanguageProvider, useLanguage } from "@/presentation/i18n/LanguageContext";
import { LanguageSelector } from "@/presentation/components/LanguageSelector";
import { ProductForm } from "@/presentation/components/ProductForm";
import { ProductTable } from "@/presentation/components/ProductTable";
import { SearchBar } from "@/presentation/components/SearchBar";
import { LogisticsMetricsGuide } from "@/presentation/components/LogisticsMetricsGuide";

const PAGE_SHELL =
  "mx-auto w-full max-w-[min(100%,1920px)] px-4 md:px-8 lg:px-12";

interface DashboardProps {
  username: string;
}

export function Dashboard({ username }: DashboardProps) {
  return (
    <LanguageProvider>
      <DashboardContent username={username} />
    </LanguageProvider>
  );
}

function DashboardContent({ username }: DashboardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const tRef = useRef(t);
  tRef.current = t;
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithMetrics | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refresh = useCallback(async (query = searchQuery) => {
    setLoading(true);
    try {
      const list = await fetchProducts(query);
      setProducts(list);
      setActionError(null);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : tRef.current.dashboard.errors.fetchFailed,
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    void refresh(query);
  };

  const handleCreate = async (input: ProductInput) => {
    try {
      await createProduct(input);
      setIsCreateOpen(false);
      setActionError(null);
      await refresh();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : tRef.current.dashboard.errors.createFailed,
      );
    }
  };

  const handleUpdate = async (input: ProductInput) => {
    if (!selectedProduct) return;
    try {
      await updateProduct(selectedProduct.id, input);
      setSelectedProduct(null);
      setActionError(null);
      await refresh();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : tRef.current.dashboard.errors.updateFailed,
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.dashboard.confirmDelete)) return;
    try {
      await deleteProduct(id);
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
      setActionError(null);
      await refresh();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : tRef.current.dashboard.errors.deleteFailed,
      );
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const openCreateForm = () => {
    setSelectedProduct(null);
    setIsCreateOpen((open) => !open);
  };

  const openProductDetail = (product: ProductWithMetrics) => {
    setIsCreateOpen(false);
    setSelectedProduct(product);
  };

  const dangerCount = products.filter((p) => p.stockStatus === "danger").length;
  const normalCount = products.filter((p) => p.stockStatus === "normal").length;
  const warningCount = products.filter((p) => p.stockStatus === "warning").length;
  const aGradeCount = products.filter((p) => p.abcGrade === "A").length;

  const statCards = [
    {
      key: "order",
      label: t.dashboard.statOrder,
      count: dangerCount,
      className: "border-red-200 bg-red-50 text-red-900",
    },
    {
      key: "normal",
      label: t.dashboard.statNormal,
      count: normalCount,
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    {
      key: "warning",
      label: t.dashboard.statWarning,
      count: warningCount,
      className: "border-amber-200 bg-amber-50 text-amber-900",
    },
    {
      key: "aGrade",
      label: t.dashboard.statAGrade,
      count: aGradeCount,
      className: "border-violet-200 bg-violet-50 text-violet-900",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <header className="w-full border-b border-slate-200 bg-white shadow-sm">
        <div
          className={`${PAGE_SHELL} flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:py-8`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {t.dashboard.systemName}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
              {t.dashboard.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{t.dashboard.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.key}
                  className={`min-w-[88px] rounded-xl border px-4 py-3 text-center text-sm ${card.className}`}
                >
                  <span className="block whitespace-nowrap text-xs opacity-80">
                    {card.label}
                  </span>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    {card.count}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <LanguageSelector />
              <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                {username}
              </span>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="whitespace-nowrap rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.dashboard.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`${PAGE_SHELL} w-full space-y-8 py-8 lg:py-10`}>
        <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="flex min-w-0 lg:col-span-9">
            <SearchBar value={searchQuery} onChange={handleSearch} />
          </div>
          <div className="flex items-center justify-stretch lg:col-span-3 lg:justify-end">
            <button
              type="button"
              onClick={openCreateForm}
              className="w-full whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 lg:w-auto"
            >
              {isCreateOpen
                ? t.dashboard.closeRegisterForm
                : t.dashboard.registerProduct}
            </button>
          </div>
        </section>

        {actionError && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        {isCreateOpen && (
          <ProductForm
            key="create"
            initial={null}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        )}

        {selectedProduct && (
          <ProductForm
            key={`edit-${selectedProduct.id}`}
            initial={selectedProduct}
            onSubmit={handleUpdate}
            onCancel={() => setSelectedProduct(null)}
          />
        )}

        {loading ? (
          <p className="w-full rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
            {t.dashboard.loadingProducts}
          </p>
        ) : (
          <ProductTable
            products={products}
            onEdit={openProductDetail}
            onDelete={(id) => void handleDelete(id)}
          />
        )}

        <LogisticsMetricsGuide />
      </main>
    </div>
  );
}
