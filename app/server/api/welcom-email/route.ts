import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/smtp';

const render = (name:string) => `
<p>Dear ${name},</p>
<p>亲爱的 ${name},</p>
<p>
  Congratulations! Your account has been successfully created. Welcome to Sapling Surrogacy, where we are committed to supporting you every step of the way on your journey to parenthood.
</p>
<p>
  恭喜您！您的账户已成功创建，欢迎加入小树苗代孕中心。我们很高兴能陪伴您开启这段特别的旅程。
</p>
<p>
  With your account, you can:
  <ul>
    <li>Track the progress of your surrogacy journey at any time.</li>
    <li>Stay connected with our team for guidance and support.</li>
    <li>Communicate with your surrogate throughout the process.</li>
  </ul>
</p>
<p>
  If you have any questions or need assistance, feel free to reply to this email or contact us. We are here to help.
</p>
<p>We look forward to being a part of your journey.</p>
<p>
  通过您的账户，您可以：
  <ul>
    <li>随时跟进您的代孕进展。</li>
    <li>与我们的团队保持联系，获取专业支持。</li>
    <li>在整个过程中与您的代孕妈妈沟通。</li>
  </ul>
</p>
<p>如有任何问题或需要帮助，欢迎直接回复此邮件或联系我们，我们随时为您提供支持。</p>
<p>期待与您携手前行！</p>
<p>
  <b>Best,</b>
  <br />
  <b>Sapling Surrogacy</b>
</p>
<p>
  <b>小树苗代孕中心团队</b>
</p>
`

export async function POST(request: Request) {
    const {email,name} = await request.json();
    console.log(email);
    
    const rep = await sendEmail({
      from: 'Sapling Surrogacy',
      to: email,
      subject: 'Welcome to Sapling Surrogacy – Your Journey Starts Here / 欢迎加入小树苗代孕中心',
      text: 'text',
      html: render(name),
  })
  // console.log(rep);
  
    return NextResponse.json(rep);
} 