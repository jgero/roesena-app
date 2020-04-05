export function arrayToMap(tagArr: string[]): { [key: string]: boolean } {
  let res: { [key: string]: boolean } = {};
  tagArr.forEach((tag) => {
    res[tag] = true;
  });
  return res;
}

export function mapToArray(tagMap: { [key: string]: boolean }): string[] {
  let res: string[] = [];
  for (const key in tagMap) {
    res.push(key);
  }
  return res;
}

export function participantArrayToMap(partArr: { id: string; amount: number }[]): { [key: string]: number } {
  let res: { [key: string]: number } = {};
  partArr.forEach((participant) => {
    res[participant.id] = participant.amount;
  });
  return res;
}

export function participantMapToArray(partMap: { [key: string]: number }): { id: string; amount: number }[] {
  let res: { id: string; amount: number }[] = [];
  for (const key in partMap) {
    res.push({ id: key, amount: partMap[key] });
  }
  return res;
}
