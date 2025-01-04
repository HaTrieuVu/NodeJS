const db = require("../models");

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
        if (!inputData.doctorId || !inputData.contentHtml || !inputData.contentMarkdown) {
            return {
                errCode: 1,
                errMessage: "Missing parameter!",
            };
        } else {
            await db.Markdown.create({
                contentHTML: inputData.contentHtml,
                contentMarkdown: inputData.contentMarkdown,
                description: inputData.description,
                doctorId: inputData.doctorId,
            });
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

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorByIdService,
};
