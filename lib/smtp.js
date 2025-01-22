import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
          host: "smtp.qq.com",
          port: 465,
          secure: true, // true for port 465, false for other ports
          auth: {
            user: "3104591385@qq.com",
            pass: "fgdhubzwocwtdfcj",
          },
        });

        const info = await transporter.sendMail({
                from: '"Maddison Foo Koch 👻" <3104591385@qq.com>', // sender address
                to: to, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
              });
            
              console.log("Message sent: %s", info.messageId);
    
};