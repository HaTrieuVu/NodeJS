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

module.exports = {
    getTopDoctorHome,
};
