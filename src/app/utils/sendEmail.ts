import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    //host: 'smtp.ethereal.email',
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'oli1412001@gmail.com',
      pass: 'auyt wrgx zcah xloa',
    },
  });

  await transporter.sendMail({
    from: 'oli1412001@gmail.com', // sender address
    to, // list of receivers
    subject: 'PASSWORD CHANGE', // Subject line
    text: 'Are you sure to reset your password?', // plain text body
    html, // html body
  });
};
