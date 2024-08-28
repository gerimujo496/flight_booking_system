export const errorMessage = {
  NOT_FOUND: (entity: string, propertyName?: string, propertyValue?: string) =>
    propertyName && propertyValue
      ? `The ${entity} with the given ${propertyName}: ${propertyValue} is not found.`
      : `The ${entity} is not found`,
  BALANCE_NOT_ENOUGH: `Insufficient balance to complete the purchase`,

  INTERNAL_SERVER_ERROR: (action: string, enitity: string) =>
    `Failed to ${action} the ${enitity}`,

  EMAIL_IN_USE: (email: string) => `Email: ${email} is in use`,

  INVALID_CREDENTIALS: `Email or password is not correct`,

  PLANE_NOT_AVAILABLE: (planeId: number, time: Date) =>
    `Plane with ID ${planeId} is not available at ${time.toISOString()}`,
};
