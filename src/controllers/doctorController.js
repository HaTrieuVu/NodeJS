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

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

let postInfoDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server",
        });
    }
};

module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
};
