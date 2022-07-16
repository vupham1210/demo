import { Contact } from '../model/Contact.js';

export const addContact = async (req , res) => {
    let response = {
        title: "Lỗi xảy ra",
        message: "Lỗi không xác định",
        type: 'warning',
        'req': req.body,
        error: true,
        status: 201,
    };
    const author = req.userId ? req.userId.user_id : '';

    let contactNew;

    try{
        if(author) {
            contactNew = new Contact({
                idSend: author,
                idReceive: req.body.idReceive,
                title: req.body.title,
                content: req.body.content,
                type: req.body.type,
            });
            await contactNew.save();
            if(contactNew){
                response = {
                    title: "Thành công",
                    message: "Đã gửi yêu cầu thành công",
                    type: 'success',
                    error: false,
                    status: 200,
                };
                return res.status(200).json(response);
            }
        }else{
            response = {
                title: "Thất bại",
                message: "Bạn phải đăng nhập",
                type: 'error',
                error: true,
                status: 201,
            };
            return res.status(201).json(response);
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

export const getContactbyType = async (req , res) => {
    let response = {
        title: "Lỗi xảy ra",
        message: "Đã có lỗi xảy ra trong quá trình lấy dữ liệu",
        type: 'warning',
        error: true,
        status: 201,
    };

    let ContactList;
    const author = req.userId ? req.userId.user_id : '';
    const typeUser = req.query.type;
    let paramss = {}
    paramss[typeUser] = author;
    try {
        if(author){
            ContactList = await Contact.find(paramss).sort({createdAt: -1});
            if(ContactList){
                response = {
                    title: "Thành công",
                    message: "lấy dữ liệu thành công",
                    type: 'success',
                    error: true,
                    status: 200,
                };
                return res.status(200).json(ContactList);
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

export const changeStatusContact = async (req , res) => {
    let response = {
        title: "Lỗi xảy ra",
        message: "Đã có lỗi xảy ra trong quá trình lấy dữ liệu",
        type: 'warning',
        error: true,
        status: 201,
    };

    let ContactChange;
    const author = req.userId ? req.userId.user_id : '';

    try {
        if(author){
            ContactChange = await Contact.findByIdAndUpdate(req.params.id,{
                status: req.query.status,
            });
            if(ContactChange){
                response = {
                    title: "Thành công",
                    message: "Đã xác nhận thành công",
                    type: 'success',
                    error: true,
                    status: 200,
                };
                return res.status(200).json(response);
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