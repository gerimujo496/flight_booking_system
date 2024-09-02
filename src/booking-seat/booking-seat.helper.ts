import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AirplaneDal } from 'src/airplane/airplane.dal';
import { FlightDal } from 'src/flight/flight.dal';
import { BookingSeatDal } from './bookingSeat.dal';
import { errorMessage } from 'src/constants/errorMessages';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { CreditDal } from 'src/credit/credit.dal';
import { UserDal } from 'src/user/user.dal';

import { BookingSeat } from './entities/booking-seat.entity';
import * as PdfPrinter from 'pdfmake';
import { createWriteStream } from 'fs';
import { BookingSeatsDto } from './dto/seats.dto';
import { GetFreeSeatsHelper } from 'src/helpers/getFreeSeats';

@Injectable()
export class BookingSeatHelper {
  constructor(
    private airplaneDal: AirplaneDal,
    private flightDal: FlightDal,
    private bookingDal: BookingSeatDal,
    private creditDal: CreditDal,
    private userDal: UserDal,
  ) {}

  isRoundTripOrThrowErrorIfFlightsAreSame(
    createBookingSeatDto: CreateBookingSeatDto,
  ) {
    const { flight_id, return_flight_id } = createBookingSeatDto;

    if (!return_flight_id) return false;

    if (flight_id == return_flight_id)
      throw new ConflictException(
        errorMessage.CONFLICT_FLIGHT_WITH_RETURN_FLIGHT,
      );

    return true;
  }

  async arePropertiesValidAndCompatibleOrThrowError(createBookingSeatDto: {
    flight_id: number;
    seat_number: number | null;
    airplane_id: number | null;
  }) {
    const { flight_id, seat_number, airplane_id } = createBookingSeatDto;

    const flight = await this.getFlightOrThrowError(flight_id);

    const airplane = await this.getAirplaneOrThrowError(airplane_id);

    if (flight.airplane_id['id'] != airplane_id)
      throw new ConflictException(errorMessage.CONFLICT_AIRPLANE_WITH_FLIGHT);

    if (seat_number > airplane.num_of_seats)
      throw new BadRequestException(
        errorMessage.SEAT_NUMBER_EXCEEDS_AIRPLANE_CAPACITY,
      );

    await this.throwErrorIfSeatIsNotFree(seat_number, flight_id, airplane_id);
  }
  async throwErrorIfUserDoNotExists(id: number) {
    const user = await this.userDal.findOneById(id);

    if (!user) throw new NotFoundException(errorMessage.NOT_FOUND(`user`));
  }
  async getAirplaneOrThrowError(id: number | null) {
    if (!id)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`airplane`, `airplaneId`, `${id}`),
      );

    const airplane = await this.airplaneDal.findOneById(id);
    if (!airplane)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`airplane`, `airplaneId`, `${id}`),
      );

    return airplane;
  }

  async getFlightOrThrowError(id: number) {
    const flight = await this.flightDal.findOneById(id);
    if (!flight)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`flight`, `flightId`, `${id}`),
      );

    return flight;
  }
  async throwErrorIfSeatIsNotFree(
    seatNumber: number,
    flightId: number,
    airplaneId: number,
  ) {
    const isSeatFree = await this.bookingDal.isSeatFree(
      seatNumber,
      flightId,
      airplaneId,
    );
    if (!isSeatFree) throw new ConflictException(errorMessage.SEAT_IS_NOT_FREE);
  }

  async throwErrorIfCreditsAreNotEnough(id: number, price: number) {
    const { credits } = await this.creditDal.findOneByUserId(id);

    if (credits < price)
      throw new ForbiddenException(errorMessage.BALANCE_NOT_ENOUGH);
  }
  async calculatePrice(flightData: {
    flightId: number;
    seat_number: number | null;
    return_seat_number: number | null;
    isRoundTrip: boolean;
  }) {
    const { flightId, seat_number, return_seat_number, isRoundTrip } =
      flightData;

    const { price } = await this.flightDal.findOneById(flightId);
    let totalPrice = price;
    if (isRoundTrip) {
      totalPrice += price;

      if (seat_number) totalPrice += 3000;

      if (return_seat_number) totalPrice += 3000;
    } else {
      if (seat_number) totalPrice += 3000;
    }
    console.log(price, totalPrice, flightData);
    return totalPrice;
  }

  async getBookingOrThrowErrorIfItDoNotExists(id: number) {
    const booking = await this.bookingDal.findOneByIdJoinColumns(id);
    if (!booking)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`booking`, `id`, `${id}`),
      );

    return booking;
  }

  async generateTicketPdf(booking: BookingSeat) {
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        { text: 'Flight Ticket', style: 'header' },
        { text: 'Passenger Information', style: 'subheader' },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              [
                { text: 'Name:', style: 'label' },
                {
                  text: `${booking.user_id['first_name']} ${booking.user_id['last_name']}`,
                  style: 'value',
                },
              ],
              [
                { text: 'Email:', style: 'label' },
                { text: booking.user_id['email'], style: 'value' },
              ],
              [
                { text: 'Country:', style: 'label' },
                { text: booking.user_id['country'], style: 'value' },
              ],
            ],
          },
          layout: 'noBorders',
        },
        { text: 'Flight Information', style: 'subheader' },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              [
                { text: 'Departure:', style: 'label' },
                {
                  text: `${booking.flight_id['departure_airport']}, ${booking.flight_id['departure_country']}`,
                  style: 'value',
                },
              ],
              [
                { text: 'Departure Time:', style: 'label' },
                {
                  text: new Date(
                    booking.flight_id['departure_time'],
                  ).toLocaleString(),
                  style: 'value',
                },
              ],
              [
                { text: 'Arrival:', style: 'label' },
                {
                  text: `${booking.flight_id['arrival_airport']}, ${booking.flight_id['arrival_country']}`,
                  style: 'value',
                },
              ],
              [
                { text: 'Arrival Time:', style: 'label' },
                {
                  text: new Date(
                    booking.flight_id['arrival_time'],
                  ).toLocaleString(),
                  style: 'value',
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        { text: 'Ticket Details', style: 'subheader' },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              [
                { text: 'Airplane:', style: 'label' },
                { text: booking.airplane_id['name'], style: 'value' },
              ],
              [
                { text: 'Seat Number:', style: 'label' },
                { text: booking.seat_number, style: 'value' },
              ],
              [
                { text: 'Price:', style: 'label' },
                { text: `$${booking.price.toFixed(2)}`, style: 'value' },
              ],
              [
                { text: 'Status:', style: 'label' },
                {
                  text:
                    booking.is_approved === null
                      ? 'Pending'
                      : booking.is_approved
                        ? 'Approved'
                        : 'Declined',
                  style: 'value',
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        { text: 'Thank you for choosing our service!', style: 'thankyou' },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 20],
          color: '#2E86C1',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 10],
          color: '#2874A6',
        },
        label: { fontSize: 12, bold: true, color: '#34495E' },
        value: { fontSize: 12, color: '#2C3E50' },
        thankyou: {
          fontSize: 14,
          italics: true,
          margin: [0, 30, 0, 0],
          color: '#2ECC71',
          alignment: 'center',
        },
      },
      defaultStyle: {
        font: 'Roboto',
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: any[] = [];

      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      pdfDoc.on('error', (err) => {
        reject(err);
      });

      pdfDoc.end();
    });
  }
}
