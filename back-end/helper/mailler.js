import nodemailer from 'nodemailer';

let transforter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'phamtruongvu1111@gmail.com',
    pass: 'jbuupyzyjmvtwqip'
  }
});

export const mailLetter = async ({receiver, subject, html}) => {
  let info = await transforter.sendMail({
    from: 'Vu Pham <phamtruongvu1111@gmail.com>',
    to: receiver != undefined ? receiver : process.env.ADMIN_EMAIL,
    subject: subject != undefined ? subject : 'Chưa có tiêu đề',
    // text: text != undefined ? text : '',
    html: html != undefined ? html : '',
  })
  return info;
}

mailLetter().catch(console.error);