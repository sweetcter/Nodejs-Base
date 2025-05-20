import nodemailer from 'nodemailer';

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
            user: 'vanhoaian.learn@gmail.com',
            pass: 'kkov fmol wfow hczc',
        },
    });

    const message = {
        from: '"Demo booksell" <vanhoaian.learn@gmail.com>',
        to: email,
        subject,
        html,
    };

    await transporter.sendMail(message);
};