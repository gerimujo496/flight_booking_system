export const query = (id: number) => `
SELECT "booking_seat"."id" AS "booking_seat_id",
       "booking_seat"."seat_number" AS "booking_seat_seat_number",
       "booking_seat"."return_seat_number" AS "booking_seat_return_seat_number",
       "booking_seat"."price" AS "booking_seat_price",
       "booking_seat"."is_approved" AS "booking_seat_is_approved",
       "booking_seat"."created_at" AS "booking_seat_created_at",
       "booking_seat"."updated_at" AS "booking_seat_updated_at",
       "booking_seat"."userIdId" AS "booking_seat_userIdId",
       "booking_seat"."flightIdId" AS "booking_seat_flightIdId",
       "booking_seat"."airplaneIdId" AS "booking_seat_airplaneIdId",
       "booking_seat"."returnFlightIdId" AS "booking_seat_returnFlightIdId",
       "booking_seat"."returnAirplaneIdId" AS "booking_seat_returnAirplaneIdId",
       "user"."id" AS "user_id",
       "user"."first_name" AS "user_first_name",
       "user"."last_name" AS "user_last_name",
       "user"."email" AS "user_email",
       "user"."password" AS "user_password",
       "user"."isAdmin" AS "user_isAdmin",
       "user"."country" AS "user_country",
       "user"."is_active" AS "user_is_active",
       "user"."createdAt" AS "user_createdAt",
       "user"."updatedAt" AS "user_updatedAt",
       "airplane"."id" AS "airplane_id",
       "airplane"."name" AS "airplane_name",
       "airplane"."num_of_seats" AS "airplane_num_of_seats",
       "airplane"."is_active" AS "airplane_is_active",
       "airplane"."created_at" AS "airplane_created_at",
       "airplane"."updated_at" AS "airplane_updated_at",
       "flight"."id" AS "flight_id",
       "flight"."departure_country" AS "flight_departure_country",
       "flight"."departure_airport" AS "flight_departure_airport",
       "flight"."departure_time" AS "flight_departure_time",
       "flight"."arrival_country" AS "flight_arrival_country",
       "flight"."arrival_airport" AS "flight_arrival_airport",
       "flight"."arrival_time" AS "flight_arrival_time",
       "flight"."price" AS "flight_price",
       "flight"."is_active" AS "flight_is_active",
       "flight"."created_at" AS "flight_created_at",
       "flight"."updated_at" AS "flight_updated_at",
       "flight"."airplaneIdId" AS "flight_airplaneIdId",
       "return_flight"."id" AS "return_flight_id",
       "return_flight"."departure_country" AS "return_flight_departure_country",
       "flight"."departure_airport" AS "return_flight_departure_airport",
       "return_flight"."departure_time" AS "return_flight_departure_time",
       "return_flight"."arrival_country" AS "return_flight_arrival_country",
       "return_flight"."arrival_airport" AS "return_flight_arrival_airport",
       "return_flight"."arrival_time" AS "return_flight_arrival_time",
       "return_flight"."price" AS "return_flight_price",
       "return_flight"."is_active" AS "return_flight_is_active",
       "return_flight"."created_at" AS "return_flight_created_at",
       "return_flight"."updated_at" AS "return_flight_updated_at",
       "return_flight"."airplaneIdId" AS "return_flight_airplaneIdId"
FROM "booking_seat" "booking_seat"
LEFT JOIN "user" "user" ON "user"."id"="booking_seat"."userIdId"
LEFT JOIN "airplane" "airplane" ON "airplane"."id"="booking_seat"."airplaneIdId"
LEFT JOIN "flight" "flight" ON "flight"."id"="booking_seat"."flightIdId"
LEFT JOIN "flight" "return_flight" ON "return_flight"."id" = "booking_seat"."returnFlightIdId"
WHERE "booking_seat"."id" = ${id}
AND "flight"."is_active" = true;
`;
