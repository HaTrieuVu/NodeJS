require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"BookingCare 👻" <trieuvuha124@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông báo đặt lịch khám bệnh", // Subject line
        html: `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch online trên BookingCare</p>
            <p>Thông tin đặt lịch khám bệnh của bạn:</p>
            <div>
                <b>Thời gian: ${dataSend.time}</b>
            </div>
            <div>
                <b>Bác sĩ: ${dataSend.doctorName}</b>
            </div>
            <p> Nếu các thông tin trên là đúng, thì bạn hãy click 
                <a href=${dataSend.redirecLink} targer="_blank">vào đây</a> 
            để xác nhận 
            </p>
            <div>Cảm ơn bạn đã tin tưởng chúng tôi!</div>

        `, // html body
    });
};

module.exports = {
    sendSimpleEmail,
};
