export const error = {
  NOT_FOUND: (entity: string, propertyName?: string, propertyValue?: string) =>
    propertyName && propertyValue
      ? `The ${entity} with the given ${propertyName}: ${propertyValue} is not found.`
      : `The ${entity} is not found`,
  BALANCE_NOT_ENOUGH: `Insufficient balance to complete the purchase`,
};
