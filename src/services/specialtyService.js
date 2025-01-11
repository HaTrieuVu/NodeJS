const db = require("../models");

let createSpecialtyService = async (data) => {
    try {
        if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            await db.Specialty.create({
                name: data.name,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
            });

            return {
                errCode: 0,
                errMessage: "Tạo chuyên khoa thành công!",
            };
        }
    } catch (error) {
        return error;
    }
};

module.exports = {};
