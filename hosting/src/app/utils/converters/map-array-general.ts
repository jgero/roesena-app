export function arrayToMap(tagArr: string[]): { [key: string]: boolean } {
  const res: { [key: string]: boolean } = {};
  tagArr.forEach((tag) => {
    res[tag] = true;
  });
  return res;
}

export function mapToArray(tagMap: { [key: string]: boolean }): string[] {
  const res: string[] = [];
  for (const key in tagMap) {
    if (tagMap.hasOwnProperty(key)) {
      res.push(key);
    }
  }
  return res;
}
