import {
  calculateSuggestedOrderQty,
  getDangerThresholdDays,
  getStockStatus,
  isDangerWithoutSuggestedQty,
} from "@/domain/services/stockAlertService";

describe("stockAlertService", () => {
  describe("getDangerThresholdDays", () => {
    it("adds lead time to 90 days", () => {
      expect(getDangerThresholdDays(14)).toBe(104);
      expect(getDangerThresholdDays(21)).toBe(111);
    });
  });

  describe("getStockStatus", () => {
    it("returns danger at or below 90 + leadTime", () => {
      expect(getStockStatus(100, 14)).toBe("danger");
      expect(getStockStatus(104, 14)).toBe("danger");
    });

    it("returns normal between danger threshold and 180", () => {
      expect(getStockStatus(105, 14)).toBe("normal");
      expect(getStockStatus(180, 14)).toBe("normal");
    });

    it("returns warning above 180 days", () => {
      expect(getStockStatus(181, 14)).toBe("warning");
    });
  });

  describe("calculateSuggestedOrderQty", () => {
    it("fills to (90 + leadTime) days of adjusted daily demand minus stock", () => {
      expect(calculateSuggestedOrderQty(2, 100, "danger", 14)).toBe(108);
    });

    it("returns 0 when not danger", () => {
      expect(calculateSuggestedOrderQty(2, 10, "normal", 14)).toBe(0);
    });

    it("never returns negative", () => {
      expect(calculateSuggestedOrderQty(1, 500, "danger", 14)).toBe(0);
    });

    it("returns 0 when adjusted daily shipment is zero", () => {
      expect(calculateSuggestedOrderQty(0, 10, "danger", 14)).toBe(0);
    });

    /**
     * 회귀: 발주 필요(회전율 ≤ 104일)인데 90일분만 채우면 수량 0이 되던 구간
     * - 일일 2, 재고 200 → 회전율 100일 → danger
     * - 구 공식(90일): 2×90-200 = -20 → 0 (UI 미표시 버그)
     * - 수정 공식(90+14일): 2×104-200 = 8
     */
    it("returns positive qty in danger gap zone (turnover between 90 and 90+leadTime)", () => {
      const daily = 2;
      const stock = 200;
      const leadTime = 14;
      const turnoverDays = stock / daily;

      expect(turnoverDays).toBe(100);
      expect(getStockStatus(turnoverDays, leadTime)).toBe("danger");
      expect(calculateSuggestedOrderQty(daily, stock, "danger", leadTime)).toBe(
        8,
      );
    });

    it("returns 0 only at exact danger threshold stock level", () => {
      const daily = 2;
      const leadTime = 14;
      const targetDays = 90 + leadTime;
      const stock = daily * targetDays;

      expect(getStockStatus(targetDays, leadTime)).toBe("danger");
      expect(calculateSuggestedOrderQty(daily, stock, "danger", leadTime)).toBe(
        0,
      );
    });
  });

  describe("danger vs suggested order consistency", () => {
    it("does not leave danger state with positive daily shipment and zero suggested qty except at threshold", () => {
      const daily = 3.5;
      const leadTime = 21;
      const stock = 300;
      const turnoverDays = stock / daily;

      expect(getStockStatus(turnoverDays, leadTime)).toBe("danger");
      expect(
        calculateSuggestedOrderQty(daily, stock, "danger", leadTime),
      ).toBeGreaterThan(0);
      expect(
        isDangerWithoutSuggestedQty(turnoverDays, leadTime, daily, stock),
      ).toBe(false);
    });
  });
});
