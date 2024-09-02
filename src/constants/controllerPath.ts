export const controller_path = {
  USER: { GET_ONE: ':id', PATCH_ONE: ':id', DELETE_ONE: ':id', GET_ALL: '' },
  AUTH: { SIGN_UP: 'sign_up', SIGN_IN: 'sign_in', SIGN_OUT: 'sign_out' },
  FLIGHT: {
    CREATE_FLIGHT: '',
    UPCOMING_FLIGHTS: 'upcoming_flights',
    FILTER: 'filter',
    GET_ALL: '',
    GET_ONE: ':id',
    PATCH_ONE: ':id',
    DELETE_ONE: ':id',
    FREE_SEATS: 'free_seats/:flightId',
  },
  CREDIT: {
    SET_VALUE: ':id',
    ADD_CREDITS: 'add_credits/:id',
    REMOVE_CREDITS: 'remove_credits/:id',
  },
  BOOKING_SEAT: {
    BOOK_SEAT: 'book_seat',
    BOOK_PREFERRED_SEAT: 'book_preferred_seat',
    BOOK_RANDOM_SEAT: 'book_random_seat',
    GET_ALL: '',
    GET_ONE: ':id',
    APPROVE_BOOKING: 'approve_booking/:id',
    REJECT_BOOKING: 'reject_booking/:id',
    USER_HISTORY: 'user_booking_history',
    PRINT_APPROVED_TICKET: 'print_ticket/:id',
  },
  AIRPLANE: {
    CREATE: '',
    GET_ALL: '',
    GET_ONE: ':id',
    PATCH_ONE: ':id',
    DELETE_ONE: ':id',
    AVAILABLE_AIRPLANES: 'available_airplanes',
  },
  STATISTIC: {
    TOTAL_REVENUE: 'total_revenue',
    NUMBER_OF_FLIGHTS: 'flight_number',
    PASSENGER_NUMBER: 'passenger_number',
    TOP_3_CLIENTS_WHO_HAVE_SPEND_MORE: 'top_3_more_spent_clients',
    TOP_3_CLIENTS_WHO_HAVE_BOOKED_MORE: 'top_3_more_booked_clients',
  },
};
