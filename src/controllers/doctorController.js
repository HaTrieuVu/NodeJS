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
            message: "Error from the server",
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
            message: "Error from the server",
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
            message: "Error from the server",
        });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getExtraInfoDoctorByIdService(req.query.doctorId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorByIdService(req.query.doctorId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

// lấy ds bệnh nhân đặt lịch khám của bác sĩ
let getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctorService(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

// gửi hóa đơn cho bệnh nhân
let sendRemedy = async (req, res) => {
    try {
        let info = await doctorService.sendRemedyService(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server",
        });
    }
};

module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
};
