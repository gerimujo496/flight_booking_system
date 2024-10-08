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

  CONFLICT_AIRPLANE_WITH_FLIGHT: `The specified airplane is not assigned to this flight.`,

  SEAT_NUMBER_EXCEEDS_AIRPLANE_CAPACITY: `The number of seats requested exceeds the airplane's capacity.`,

  SEAT_IS_NOT_FREE: `Seat is not free`,

  SEAT_NUMBER_REQUIRED: `seatNumber is required `,

  BOOKING_IS_NOT_APPROVED:
    'Booking cannot be printed because it has not been approved.',

  BOOKING_CONFLICT: (state: string) => `Booking already ${state}`,

  ARRIVAL_TIME_MUST_BE_AFTER: 'Arrival time must be after the departure time',

  CONFLICT_FLIGHT_WITH_RETURN_FLIGHT: `The id of flight_id should not be equal to return_flight_id`,

  NO_AVAILABLE_SEATS: `'No seats are available for this flight.'`,
};
