import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface MailOptions {
    email: string;
    subject: string;
    html: string;
}

export const mailSender = async ({ email, subject, html }: MailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: '"Demo booksell" <${process.env.EMAIL_USER}>',
        to: email,
        subject,
        html,
    };

    await transporter.sendMail(message);
};
