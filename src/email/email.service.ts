import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendgridClient } from './sendgrid-client';
import { BookingSeat } from 'src/booking-seat/entities/booking-seat.entity';

@Injectable()
export class EmailService {
  constructor(private readonly sendGridClient: SendgridClient) {}

  async sendTestEmail(
    recipient: string,
    body = 'This is a test mail',
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: 'geri.mujo@softup.co',
      subject: 'Test email',
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridClient.send(mail);
  }

  async sendApprovedBooking(
    recipient: string,
    booking: BookingSeat,
    pdfBuffer: Buffer,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,

      from: 'geri.mujo@softup.co',
      templateId: 'd-a070b15f312d4bbdb772948009e1e648',
      dynamicTemplateData: {
        user: `${booking.user_id['first_name']} ${booking.user_id['last_name']}`,
        bookingId: booking.id,
        departureAirport: booking.flight_id['departure_airport'],
        departureCountry: booking.flight_id['departure_country'],
        arrivalAirport: booking.flight_id['arrival_airport'],
        arrivalCountry: booking.flight_id['arrival_country'],
        departureTime: new Date(
          booking.flight_id['departure_time'],
        ).toLocaleString(),
        arrivalTime: new Date(
          booking.flight_id['arrival_time'],
        ).toLocaleString(),
        seatNumber: booking.seat_number,
        price: `${booking.price} $`,
      },
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: 'ticket.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };
    await this.sendGridClient.send(mail);
  }

  async sendRejectedBooking(
    recipient: string,
    booking: BookingSeat,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,

      from: 'geri.mujo@softup.co',
      templateId: 'd-91ed0e2ee9a048ae8d55d498480db362',
      dynamicTemplateData: {
        user: `${booking.user_id['first_name']} ${booking.user_id['last_name']}`,
        bookingId: booking.id,
        departureAirport: booking.flight_id['departure_airport'],
        departureCountry: booking.flight_id['departure_country'],
        arrivalAirport: booking.flight_id['arrival_airport'],
        arrivalCountry: booking.flight_id['arrival_country'],
        departureTime: new Date(
          booking.flight_id['departure_time'],
        ).toLocaleString(),
        arrivalTime: new Date(
          booking.flight_id['arrival_time'],
        ).toLocaleString(),
        seatNumber: booking.seat_number,
        price: `${booking.price} $`,
      },
    };
    await this.sendGridClient.send(mail);
  }
}
