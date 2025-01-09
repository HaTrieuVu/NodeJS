const db = require("../models");
require("dotenv").config();

import _, { includes } from "lodash";
import moment from "moment";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = async (limit) => {
    try {
        let doctors = await db.User.findAll({
            limit: limit,
            where: { roleId: "R2" },
            order: [["createdAt", "DESC"]],
            attributes: { exclude: ["password"] },
            include: [
                { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] },
            ],
            raw: true,
            nest: true,
        });

        return {
            errCode: 0,
            data: doctors,
        };
    } catch (error) {
        return error;
    }
};

let getAllDoctors = async () => {
    try {
        let doctors = await db.User.findAll({
            where: { roleId: "R2" },
            raw: true,
            attributes: { exclude: ["password", "image"] },
        });
        return {
            errCode: 0,
            data: doctors,
        };
    } catch (error) {
        return error;
    }
};

let saveDetailInfoDoctor = async (inputData) => {
    try {
        if (
            !inputData.doctorId ||
            !inputData.contentHtml ||
            !inputData.contentMarkdown ||
            !inputData.action ||
            !inputData.selectedPrice ||
            !inputData.selectedPaymemt ||
            !inputData.selectedProvince ||
            !inputData.addressClinic ||
            !inputData.nameClinic
        ) {
            return {
                errCode: 1,
                errMessage: "Missing parameter!",
            };
        } else {
            if (inputData.action === "EDIT") {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                });
                if (doctorMarkdown) {
                    doctorMarkdown.contentHTML = inputData.contentHtml;
                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMarkdown.description = inputData.description;
                    doctorMarkdown.updatedAt = new Date();

                    await doctorMarkdown.save();
                }
            } else if (inputData.action === "CREATE") {
                await db.Markdown.create({
                    contentHTML: inputData.contentHtml,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                });
            }

            //upsert to doctor_info table
            let doctorInfo = await db.Doctor_Infor.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false,
            });

            if (doctorInfo) {
                //update
                doctorInfo.priceId = inputData.selectedPrice;
                doctorInfo.provinceId = inputData.selectedProvince;
                doctorInfo.paymentId = inputData.selectedPaymemt;
                doctorInfo.addressClinic = inputData.addressClinic;
                doctorInfo.nameClinic = inputData.nameClinic;
                doctorInfo.note = inputData.note ? inputData.note : "";

                await doctorInfo.save();
            } else {
                //create
                await db.Doctor_Infor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPrice,
                    provinceId: inputData.selectedProvince,
                    paymentId: inputData.selectedPaymemt,
                    addressClinic: inputData.addressClinic,
                    nameClinic: inputData.nameClinic,
                    note: inputData.note ? inputData.note : "",
                });
            }
        }
        return {
            errCode: 0,
            errMessage: "Lưu thông tin bác sĩ thành công!",
        };
    } catch (error) {
        return error;
    }
};

let getDetailDoctorByIdService = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let data = await db.User.findOne({
                where: { id: inputId },
                attributes: { exclude: ["password"] },
                //include : lấy thông tin của user và include thông tin của user trong bảng Markdown
                include: [
                    { model: db.Markdown, attributes: ["description", "contentHTML", "contentMarkdown"] },
                    { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ["id", "doctorId"],
                        },
                        include: [
                            { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                            { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                            { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
                        ],
                    },
                ],
                raw: false,
                nest: true,
            });

            //convert anh thanh base64 tra ve client
            if (data && data.image) {
                data.image = new Buffer(data.image, "base64").toString("binary");
            }

            if (!data) data = {};

            return {
                errCode: 0,
                data: data,
            };
        }
    } catch (error) {
        return error;
    }
};

let bulkCreateScheduleService = async (data) => {
    try {
        if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter",
            };
        } else {
            let shedule = data.arrSchedule;
            if (shedule && shedule.length > 0) {
                shedule = shedule.map((item) => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                });
            }

            //get all data
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId },
                attributes: ["timeType", "date", "doctorId", "maxNumber"],
                raw: true,
            });

            //format lai date de so sanh
            if (existing && existing.length > 0) {
                existing = existing
                    .map((item) => {
                        item.date = moment(item.date).format("DD/MM/YYYY");
                        return item;
                    })
                    .filter((item) => item.date === data.formatedDate);
            }

            //tra ve mang phan tu khac biet (compare different)
            let toCreate = _.differenceWith(shedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date;
            });

            if (toCreate && toCreate.length > 0) {
                toCreate = toCreate.map((item) => {
                    item.date = moment(item.date, "DD/MM/YYYY").format("YYYY-MM-DD");
                    return item;
                });
                await db.Schedule.bulkCreate(toCreate);
            }

            return {
                errCode: 0,
                errMessage: "Tạo lịch khám thành công",
            };
        }
    } catch (error) {
        return error;
    }
};

let getScheduleByDateService = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let data = await db.Schedule.findAll({
                where: { doctorId: doctorId },
                include: [{ model: db.Allcode, as: "timeTypeData", attributes: ["valueEn", "valueVi"] }],
                raw: false,
                nest: true,
            });

            const filteredData = data.filter(
                (item) =>
                    moment(item.date, "DD/MM/YYYY").isValid() &&
                    moment(item.date, "DD/MM/YYYY").format("DD/MM/YYYY") === date
            );

            if (!filteredData) filteredData = [];

            return {
                errCode: 0,
                data: filteredData,
            };
        }
    } catch (error) {
        return error;
    }
};

let getExtraInfoDoctorByIdService = async (doctorId) => {
    try {
        if (!doctorId) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let data = await db.Doctor_Infor.findOne({
                where: { doctorId: doctorId },
                attributes: { exclude: ["doctorId", "id"] },
                include: [
                    { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                    { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                    { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
                ],
                raw: false,
                nest: true,
            });

            if (!data) data = {};

            return {
                errCode: 0,
                data: data,
            };
        }
    } catch (error) {
        return error;
    }
};

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleByDateService,
    getExtraInfoDoctorByIdService,
};
