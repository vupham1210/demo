import { ServicesBooking } from '../model/Posts.js';


export const getBooking = async (req, res) => {
    let response = {
        title: "Lỗi xảy ra",
        message: "Đã có lỗi xảy ra trong quá trình lấy dữ liệu",
        type: 'warning',
        error: true,
        status: 201,
    };
    let BookingForm;
    const author = req.userId ? req.userId.user_id : '';

    try {
        if(author){
            BookingForm = await ServicesBooking.find({author: author});
            if(BookingForm){
                response = {
                    title: "Thành công",
                    message: "lấy dữ liệu thành công",
                    type: 'success',
                    error: true,
                    status: 200,
                };
                return res.status(200).json(BookingForm);
            }
        } else {
            response = {
                title: "Lỗi xảy ra",
                message: "Tài khoản không hợp lệ",
                type: 'warning',
                error: true,
                status: 201,
            };
            res.status(201).json(response);
        }
        
    } catch (error) {
        console.log(error)
    }
    res.status(400).json(response);
}

export const addBooking = async (req, res) => {

    let response = {
        title: "Lỗi xảy ra",
        message: "Đã có lỗi xảy ra trong quá trình tạo thông tin",
        type: 'warning',
        error: true,
        status: 201,
    };

    let bookingservices;

    try {
        bookingservices = new ServicesBooking({
            title: req.body.title,
            content: req.body.content,
            description: '',
            thumbnail: req.body.thumbnail ? req.body.thumbnail : '',
            gallery: req.body.gallery,
            postIn: new Date(),
            status: 'pending',
            // Booking Post
            location: '',
            startDate: req.body.startDate ? req.body.startDate : '',
            startEnd: req.body.startEnd ? req.body.startEnd : '',
            time: req.body.time,
            author: req.userId.user_id,
          });

        await bookingservices.save();

        if(bookingservices){
            response = {
                title: "Thành công",
                message: "Đã tạo thành công bài viết",
                type: 'success',
                error: false,
                status: 200,
            };
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        response = {
            title: "Lỗi xảy ra",
            message: "Đã có lỗi xảy ra trong quá trình tạo thông tin",
            type: 'warning',
            error: true,
            status: 400,
        };
        return res.status(400).json(response);
    }
    return res.status(201).json(response);
}

export const updateBooking = (req, res) => {
    res.status(200).json({ status: 'updateBooking'});
}

export const deleteBooking = (req, res) => {
    res.status(200).json({ status: 'deleteBooking'});
}