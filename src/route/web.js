import express from "express";

import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers//clinicController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putEditCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post("/api/login", userController.handleLogin);
    // get all user
    router.get("/api/get-all-user", userController.handleGetAllUser);
    // api create new user
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    //api edit user
    router.put("/api/edit-user", userController.handleEditUser);
    //api delete user
    router.delete("/api/delete-user", userController.handleDeleteUser);
    //api get RoleUser
    router.get("/api/allcode", userController.getAllCode);

    //-------------------------------------//
    //lay bac si top dau
    router.get("/api/top-doctor-home", doctorController.getTopDoctor);

    //lấy tất cả bác sĩ
    router.get("/api/get-all-doctors", doctorController.getAllDoctors);

    //lưu thông tin thêm về bác sĩ
    router.post("/api/save-info-doctors", doctorController.postInfoDoctors);

    // lấy thông tin chi tiết của 1 bác sĩ
    router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);

    //lưu thông tin lịch khám bệnh của bác sĩ
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);

    //lấy lịch khám của bác sĩ theo ngày đc chọn
    router.get("/api/get-schedule-doctor-by-date", doctorController.getScheduleByDate);

    //lấy thông tin thêm (giá khám, địa chỉ, ..) của bác sĩ
    router.get("/api/get-extra-info-doctor-by-id", doctorController.getExtraInfoDoctorById);

    // lấy thông tin thêm của bác sĩ cho modal đặt lịch khám
    router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDoctorById);

    //===========================
    // lấy ds bệnh nhân đặt lịch khám của bác sĩ
    router.get("/api/get-list-patient-for-doctor", doctorController.getListPatientForDoctor);

    //=====================================
    // bệnh nhân đặt lịch khám và lưu vào database
    router.post("/api/patient-book-appointment", patientController.postBookAppointment);

    // api xác nhận lịch khám bệnh của bệnh nhân
    router.post("/api/verify-book-appointment", patientController.postVerifyBookAppointment);

    //==========================================
    // api tạo mới chuyên khoa
    router.post("/api/create-new-specialty", specialtyController.createSpecialty);
    // lấy tất cả chuyên khoa kham bệnh
    router.get("/api/get-specialty", specialtyController.getAllSpecialty);
    // lấy tất cả bác sĩ của chuyên khoa
    router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById);

    //======================
    // api tạo mới phòng khám
    router.post("/api/create-new-clinic", clinicController.createClinic);
    // lấy tất cả các phòng khám
    router.get("/api/get-clinic", clinicController.getAllClinic);
    // lấy tất cả thông tin của phòng khám
    router.get("/api/get-detail-clinic-by-id", clinicController.getDetailClinicById);

    return app.use("/", router);
};
module.exports = initWebRoutes;
