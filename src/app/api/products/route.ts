import { NextRequest, NextResponse } from "next/server";
import type { ProductInput } from "@/domain/entities/Product";
import { ProductUseCases } from "@/application/use-cases/productUseCases";
import { getProductRepository } from "@/infrastructure/repositories/getProductRepository";

function getUseCases() {
  return new ProductUseCases(getProductRepository());
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const products = await getUseCases().listProducts(q);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  let input: ProductInput;
  try {
    input = (await request.json()) as ProductInput;
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  try {
    const product = await getUseCases().registerProduct(input);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "상품 등록에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
