import { ScheduleBooking } from '../model/Schedule.js';

export const addSchedule = async (req , res) => {
    let response = {
        title: "Lỗi xảy ra",
        message: "Lỗi không xác định",
        type: 'warning',
        'req': req.body,
        error: true,
        status: 201,
    };

    let scheduleBooking;

    try{
        scheduleBooking = new ScheduleBooking({
            idService: req.body.idService,
            idAuthor: req.body.idAuthor,
            timePick: {
                timeStart: req.body.timeStart,
                timeEnd: req.body.timeEnd
            },
            ortherInfo: req.body.ortherInfo,
        });
        await scheduleBooking.save();
        if(scheduleBooking){
            response = {
                title: "Thành công",
                message: "Đã tạo đặt lịch thành công",
                type: 'success',
                error: false,
                status: 200,
            };
            return res.status(200).json(response);
        }
    }catch(err){
        console.log(err);
        response = {
            title: "Lỗi xảy ra",
            message: "Đã có lỗi xảy ra trong quá trình tạo thông tin",
            type: 'warning',
            error: true,
            'req': req.body,
            status: 400,
        };
        return res.status(400).json(response);  
    }
    return res.status(201).json(response);
}

export const getAllSchedule = async (req , res) => {
    let response = {
        title: "Lỗi xảy ra",
        message: "Đã có lỗi xảy ra trong quá trình lấy dữ liệu",
        type: 'warning',
        error: true,
        status: 201,
    };

    let ScheduleList;
    const author = req.userId ? req.userId.user_id : '';
    
    let params = {
        idAuthor: author
    }

    try {
        if(author){
            ScheduleList = await ScheduleBooking.find(params);
            if(ScheduleList){
                response = {
                    title: "Thành công",
                    message: "lấy dữ liệu thành công",
                    type: 'success',
                    error: true,
                    status: 200,
                };
                return res.status(200).json(ScheduleList);
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