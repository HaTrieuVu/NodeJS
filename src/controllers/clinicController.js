const clinicService = require("../services/clinicService");

let createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinicService(req.body);
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
    createClinic,
};
