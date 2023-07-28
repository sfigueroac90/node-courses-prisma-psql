export const removeField = <T, K extends keyof T>(obj: T, keyToRemove: K) => {
  return Object.entries(obj)
    .filter(([k, val]) => k !== keyToRemove)
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {}) as unknown as Omit<T, K>;
};
