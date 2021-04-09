import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
	const testAccount = await nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	});

	const info = await transporter.sendMail({
		from: '"Fred Foo" <foo@example.com>',
		to,
		subject: 'Hello World',
		html,
	});

	console.log('Message sent : %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
