export const assetNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};
