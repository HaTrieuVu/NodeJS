import express from "express";

import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);

    router.get("/get-crud", homeController.displayGetCRUD);

    //update
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putEditCRUD);

    //delete
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
    //lưu thông tin bác sĩ
    router.post("/api/save-info-doctors", doctorController.postInfoDoctors);

    return app.use("/", router);
};
module.exports = initWebRoutes;
