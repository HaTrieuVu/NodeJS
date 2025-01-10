const patientService = require("../services/patientService");

let postBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookAppointmentService(req.body);
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
    postBookAppointment,
};
