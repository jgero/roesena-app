export interface ConversionTarget {
  width: number;
  height: number;
  dir: string;
  quality: number;
}

export const targetSizes: ConversionTarget[] = [
  { width: 800, height: 550, dir: 'full', quality: 80 },
  { width: 300, height: 200, dir: 'thumb', quality: 50 },
];

export function getFilenameForTarget(target: ConversionTarget, fileName: string) {
  return `${target.dir}@${target.width}x${target.height}_${fileName}`;
}
