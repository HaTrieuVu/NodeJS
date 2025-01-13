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

let getAllSpecialtyService = async () => {
    try {
        let data = await db.Specialty.findAll();

        if (data && data.length > 0) {
            data.map((item) => {
                item.image = new Buffer(item.image, "base64").toString("binary");
                return item;
            });
        }

        return {
            errCode: 0,
            errMessage: "Ok",
            data: data,
        };
    } catch (error) {
        return error;
    }
};

module.exports = {
    createSpecialtyService,
    getAllSpecialtyService,
};
