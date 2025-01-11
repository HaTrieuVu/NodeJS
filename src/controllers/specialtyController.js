const specialtyService = require("../services/specialtyService");

let createSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createSpecialtyService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            error: -1,
            errMessage: "Error from server",
        });
    }
};

module.exports = {
    createSpecialty,
};
