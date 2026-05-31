import type { ProductInput, ProductWithMetrics } from "@/domain/entities/Product";

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchProducts(
  searchQuery = "",
): Promise<ProductWithMetrics[]> {
  const params = new URLSearchParams();
  if (searchQuery.trim()) params.set("q", searchQuery.trim());
  const qs = params.toString();
  const res = await fetch(`/api/products${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createProduct(
  input: ProductInput,
): Promise<ProductWithMetrics> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductWithMetrics> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res));
}
