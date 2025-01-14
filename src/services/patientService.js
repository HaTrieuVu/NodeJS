const db = require("../models");
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";

import emailService from "./emailService";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let postBookAppointmentService = async (data) => {
    try {
        if (
            !data.email ||
            !data.doctorId ||
            !data.timeType ||
            !data.date ||
            !data.fullName ||
            !data.selectedGender ||
            !data.address ||
            !data.phoneNumber
        ) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let token = uuidv4();
            // gửi email
            await emailService.sendSimpleEmail({
                reciverEmail: data.email,
                patientName: data.fullName,
                time: data.time,
                doctorName: data.doctorName,
                redirecLink: buildUrlEmail(data.doctorId, token),
            });

            //upsert patient
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: "R3",
                    lastName: data.fullName,
                    address: data.address,
                    gender: data.selectedGender,
                    phoneNumber: data.phoneNumber,
                },
            });
            if (user && user[0]) {
                await db.Booking.findOrCreate({
                    where: { patientId: user[0].id },
                    defaults: {
                        statusId: "S1",
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token,
                    },
                });
            }

            return {
                errCode: 0,
                errMessage: "Tạo lịch khám thành công!",
            };
        }
    } catch (error) {
        return error;
    }
};

let postVerifyBookAppointmentService = async (data) => {
    try {
        if (!data.token || !data.doctorId) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    token: data.token,
                    statusId: "S1",
                },
                raw: false,
            });
            if (appointment) {
                appointment.statusId = "S2";
                await appointment.save();
                return {
                    errCode: 0,
                    errMessage: "Xác nhận lịch khám thành công!",
                };
            } else {
                return {
                    errCode: 2,
                    errMessage: "Lịch hẹn khám đã được xác nhận hoặc không tồn tại!",
                };
            }
        }
    } catch (error) {
        return error;
    }
};

module.exports = {
    postBookAppointmentService,
    postVerifyBookAppointmentService,
};
