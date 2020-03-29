export function tagArrayToMap(tagArr: string[]): { [key: string]: boolean } {
  let res: { [key: string]: boolean } = {};
  tagArr.forEach(tag => {
    res[tag] = true;
  });
  return res;
}

export function tagMapToArray(tagMap: { [key: string]: boolean }): string[] {
  let res: string[] = [];
  for (const key in tagMap) {
    res.push(key);
  }
  return res;
}
