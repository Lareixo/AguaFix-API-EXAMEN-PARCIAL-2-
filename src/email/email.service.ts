import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.mailer.service,
    auth: {
      user: envs.mailer.user,
      pass: envs.mailer.password,
    },
  });

  async sendEmail(
    to: string,
    subject: string,
    template: string,
  ): Promise<void> {

    await this.transporter.verify();

    console.log('Conexión con Gmail correcta');

    await this.transporter.sendMail({
      from: envs.mailer.user,
      to,
      subject,
      html: template,
    });

    console.log('Correo enviado correctamente');
  }
}