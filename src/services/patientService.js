const db = require("../models");
require("dotenv").config();

let postBookAppointmentService = async (data) => {
    try {
        if (!data.email || !data.doctorId || !data.timeType || !data.date) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            //upsert patient
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: "R3",
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

module.exports = {
    postBookAppointmentService,
};
