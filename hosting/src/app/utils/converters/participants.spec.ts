import { participantArrayToMap, participantMapToArray } from "./participants";

describe("participant converter", () => {
  it("should convert from array to map", () => {
    const a = [
      { id: "asdf", amount: 1, name: "qwer" },
      { id: "jklö", amount: 2, name: "uiop" },
    ];
    const b = participantArrayToMap(a);
    expect(b).toEqual({
      ["asdf"]: { name: "qwer", amount: 1 },
      ["jklö"]: { name: "uiop", amount: 2 },
    });
  });

  it("should convert from map to array", () => {
    const a = {
      ["asdf"]: { name: "qwer", amount: 1 },
      ["jklö"]: { name: "uiop", amount: 2 },
    };
    const b = participantMapToArray(a);
    expect(b).toEqual([
      { id: "asdf", amount: 1, name: "qwer" },
      { id: "jklö", amount: 2, name: "uiop" },
    ]);
  });
});
