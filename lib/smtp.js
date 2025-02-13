import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true, // true for port 465, false for other ports
      auth: {
        user: "loyaltly.cn@gmail.com",
        pass: "owxtwvuqejjnxokp",
      },
    });

export const sendcode = async ({ to, html }) => {

        const info = await transporter.sendMail({
                from: '"Welcome to Sapling Surrogacy', // sender address
                to: to, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>验证码:${html}</b>`, // html body
              });
            
              console.log("Message sent: %s", info.messageId);
    
};



export const sendEmail = async ({ from, to, subject, text, html }) => {
    console.log(`to:${to}`);
    
        const info = await transporter.sendMail({
            from: from,
                to: to, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                html: html, // html body
              });
            
              console.log("Message sent: %s", info.messageId);
    
};