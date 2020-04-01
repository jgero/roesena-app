export function participantArrayToMap(partArr: { id: string; amount: number }[]): { [key: string]: number } {
  let res: { [key: string]: number } = {};
  partArr.forEach(participant => {
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
