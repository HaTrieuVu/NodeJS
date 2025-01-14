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

let getAllClinicService = async () => {
    try {
        let data = await db.Clinic.findAll();

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

let getDetailClinicByIdService = async (id) => {
    try {
        if (!id) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let data = await db.Clinic.findOne({
                where: { id: id },
                attributes: ["name", "address", "descriptionHTML", "descriptionMarkdown", "image"],
            });

            if (data && data.image) {
                data.image = new Buffer(data.image, "base64").toString("binary");
            }

            if (data) {
                let doctorClinic = [];
                doctorClinic = await db.Doctor_Infor.findAll({
                    where: { clinicId: id },
                    attributes: ["doctorId", "provinceId"],
                });

                data.doctorClinic = doctorClinic;
            } else {
                data = [];
            }

            return {
                errCode: 0,
                errMessage: "Ok",
                data: data,
            };
        }
    } catch (error) {
        return error;
    }
};

module.exports = {
    createClinicService,
    getAllClinicService,
    getDetailClinicByIdService,
};
