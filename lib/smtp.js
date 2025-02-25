import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true, // true for port 465, false for other ports
      auth: {
        user: "info@saplingsurrogacy.com",
        pass: "oclkiksjuigausam",
      },
    });


const _code = (code) => `
<p>
Hi/您好
</p>


<p>
   
Thanks for signing up with Sapling Surrogacy! To verify your email and complete your registration, enter the code below:</br>
Your Code:${code}</br>
This code expires in 30 minutes. If you didn’t sign up, just ignore this email.

</p>
<p>
   
感谢您注册 Sapling Surrogacy！请使用以下验证码完成邮箱验证并完成注册：</br>
您的验证码： ${code}</br>
此验证码将在30分钟内过期。如果您没有注册，请忽略此邮件。
</p>

<p>
Need help? Contact us anytime!</br>
Welcome to Sapling Surrogacy!</br>
<p/>

<p>

如需帮助，请随时联系我们！</br>
欢迎加入 Sapling Surrogacy！</br>
<p/>
`

export const sendcode = async ({ to, html }) => {

        const info = await transporter.sendMail({
                from: '"from to Sapling Surrogacy', // sender address
                to: to, // list of receivers
                subject: "Your Sapling Surrogacy Verification Code / 您的 Sapling Surrogacy 验证码", // Subject line
                text: "Hello world?", // plain text body
                html: _code(html), // html body
              });
            
              console.log("Message sent: %s", info.messageId);
    
};



export const sendEmail = async ({ from, to, subject, text, html }) => {
    console.log(`to:${to}`);
    
        return await transporter.sendMail({
            from: from,
                to: to, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                html: html, // html body
              });
    
};