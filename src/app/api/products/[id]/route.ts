import { NextRequest, NextResponse } from "next/server";
import type { ProductInput } from "@/domain/entities/Product";
import { ProductUseCases } from "@/application/use-cases/productUseCases";
import { getProductRepository } from "@/infrastructure/repositories/getProductRepository";

function getUseCases() {
  return new ProductUseCases(getProductRepository());
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  let input: ProductInput;
  try {
    input = (await request.json()) as ProductInput;
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  try {
    const product = await getUseCases().updateProduct(id, input);
    return NextResponse.json(product);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "상품 수정에 실패했습니다.";
    const status = message.includes("찾을 수 없습니다") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await getUseCases().removeProduct(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "상품 삭제에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
