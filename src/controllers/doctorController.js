import doctorService from "../services/doctorService";

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

module.exports = {
    getTopDoctor: getTopDoctor,
};