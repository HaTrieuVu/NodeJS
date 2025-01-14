const db = require("../models");

let createClinicService = async (data) => {
    try {
        if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            await db.Clinic.create({
                name: data.name,
                address: data.address,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
            });

            return {
                errCode: 0,
                errMessage: "Tạo phòng khám thành công!",
            };
        }
    } catch (error) {
        return error;
    }
};

module.exports = {
    createClinicService,
};
