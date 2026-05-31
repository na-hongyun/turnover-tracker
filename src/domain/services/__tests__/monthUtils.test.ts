import {
  getLastThreeMonthSlots,
  createEmptyShipmentsForLastThreeMonths,
} from "@/domain/services/monthUtils";

describe("getLastThreeMonthSlots", () => {
  it("5월 기준 직전 3개월은 4월, 3월, 2월", () => {
    const slots = getLastThreeMonthSlots(new Date(2026, 4, 15));
    expect(slots.map((s) => s.monthKey)).toEqual([
      "2026-04",
      "2026-03",
      "2026-02",
    ]);
  });
});

describe("createEmptyShipmentsForLastThreeMonths", () => {
  it("3개월 슬롯에 quantity 0을 생성한다", () => {
    const shipments = createEmptyShipmentsForLastThreeMonths(
      new Date(2026, 4, 1),
    );
    expect(shipments).toHaveLength(3);
    expect(shipments.every((s) => s.quantity === 0)).toBe(true);
  });
});
