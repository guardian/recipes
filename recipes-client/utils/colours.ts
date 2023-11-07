import { excludeInForm } from "~consts";

export function createColourMap(
  keyList: string[],
  colours: string[],
  excludeItems?: string[],
): Record<string, string> {
  const excluded = excludeItems === undefined ? [] : excludeItems;
  return keyList.reduce(
    (acc, key, i) => {
      if (!excluded.includes(key)) {
        acc[key] = colours[i % colours.length];
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
