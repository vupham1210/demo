import { database } from './api/Database.js';
import { mailLetter } from './helper/mailler.js';

// const main = mailLetter({
//   reciever: 'hoanpro698@gmail.com', 
//   subject: 'tiêu đề email', 
//   // text: 'nội dung text', 
//   html: '<b>Nội dung HTML</b>'
// });

const Data = database(); 
