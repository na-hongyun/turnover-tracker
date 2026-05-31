import {
  calculateAdjustedDailyShipment,
  calculateSimpleDailyShipment,
  calculateTurnoverDays,
} from "@/domain/services/turnoverCalculator";
import { INFINITE_TURNOVER_DAYS } from "@/domain/constants/scmConstants";

describe("turnoverCalculator", () => {
  describe("calculateSimpleDailyShipment", () => {
    it("computes (M1+M2+M3)/3/30", () => {
      expect(calculateSimpleDailyShipment(90, 60, 30)).toBeCloseTo(2, 5);
    });
  });

  describe("calculateAdjustedDailyShipment", () => {
    it("applies seasonality index", () => {
      const simple = calculateSimpleDailyShipment(90, 60, 30);
      expect(calculateAdjustedDailyShipment(simple, 1.5)).toBeCloseTo(3, 5);
    });

    it("reduces with index below 1", () => {
      const simple = calculateSimpleDailyShipment(30, 30, 30);
      expect(calculateAdjustedDailyShipment(simple, 0.7)).toBeCloseTo(0.7, 5);
    });
  });

  describe("calculateTurnoverDays", () => {
    it("returns stock / adjusted daily", () => {
      expect(calculateTurnoverDays(120, 2)).toBe(60);
    });

    it("returns 999 when adjusted daily is 0", () => {
      expect(calculateTurnoverDays(100, 0)).toBe(INFINITE_TURNOVER_DAYS);
    });
  });
});
