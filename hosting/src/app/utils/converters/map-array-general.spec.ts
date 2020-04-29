import { arrayToMap, mapToArray } from "./map-array-general";

describe("general map-array converter", () => {
  it("should convert from array to map", () => {
    const a = ["item 1", "item 2", "item 3"];
    const b = arrayToMap(a);
    expect(b).toEqual({ ["item 1"]: true, ["item 2"]: true, ["item 3"]: true });
  });

  it("should convert from map to array", () => {
    const a = { ["item 1"]: true, ["item 2"]: true, ["item 3"]: true };
    const b = mapToArray(a);
    expect(b).toEqual(["item 1", "item 2", "item 3"]);
  });
});
