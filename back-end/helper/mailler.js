import nodemailer from 'nodemailer';

let transforter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'southteammailer@gmail.com',
    pass: 'ubzkegqabppitafk'
  }
});

export const mailLetter = async ({reciever, subject, html}) => {
  console.log(reciever);
  let info = await transforter.sendMail({
    from: 'Vu Pham <vupham@southteam.co>',
    to: reciever != undefined ? reciever : process.env.ADMIN_EMAIL,
    subject: subject != undefined ? subject : 'Chưa có tiêu đề',
    // text: text != undefined ? text : '',
    html: html != undefined ? html : '',
  })
  return info;
}

mailLetter().catch(console.error);