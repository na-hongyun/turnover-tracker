import {
  assignAbcGrades,
  calculateShipmentValue,
  sortForDashboard,
} from "@/domain/services/abcAnalysisService";

describe("abcAnalysisService", () => {
  it("calculates 3-month shipment value", () => {
    expect(calculateShipmentValue(10, 20, 30, 1000)).toBe(60000);
  });

  it("assigns A/B/C by rank percentiles", () => {
    const items = [
      { id: "1", shipmentValue: 1000 },
      { id: "2", shipmentValue: 800 },
      { id: "3", shipmentValue: 500 },
      { id: "4", shipmentValue: 300 },
      { id: "5", shipmentValue: 100 },
    ];
    const grades = assignAbcGrades(items);
    expect(grades.get("1")).toBe("A");
    expect(grades.get("2")).toBe("B");
    expect(grades.get("3")).toBe("B");
    expect(grades.get("4")).toBe("C");
    expect(grades.get("5")).toBe("C");
  });

  it("sorts A grade before B and C", () => {
    const sorted = sortForDashboard([
      { abcGrade: "C" as const, shipmentValue: 999 },
      { abcGrade: "A" as const, shipmentValue: 1 },
      { abcGrade: "B" as const, shipmentValue: 500 },
    ]);
    expect(sorted.map((s) => s.abcGrade)).toEqual(["A", "B", "C"]);
  });
});
