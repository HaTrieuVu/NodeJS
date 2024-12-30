const db = require("../models");
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);

            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password", "firstName", "lastName"],
                    where: { email: email },
                    raw: true,
                });

                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.message = "Success";

                        delete user.password;

                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `User's not found!`;
                }
            } else {
                userData.errCode = 1;
                userData.message = `Your's Email isn't exist in your system. Please try other email!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = async (userId) => {
    try {
        let users = "";
        if (userId === "All") {
            users = await db.User.findAll({
                attributes: { exclude: ["password"] },
                raw: true,
            });
        }
        if (userId && userId !== "All") {
            users = await db.User.findOne({
                attributes: { exclude: ["password"] },
                where: { id: userId },
                raw: true,
            });
        }
        return users;
    } catch (error) {
        return error;
    }
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = async (data) => {
    try {
        let checkEmail = await checkUserEmail(data.email);
        if (checkEmail === true) {
            return {
                errCode: 1,
                message: "Email đã được sử dụng! Bạn hãy sử dung eamil khác",
            };
        } else {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                roleId: data.roleId,
                positionId: data.positionId,
            });

            return {
                errCode: 0,
                message: "Đăng ký thành công!",
            };
        }
    } catch (error) {
        return error;
    }
};

let updateUser = async (userData) => {
    try {
        if (!userData.id) {
            return {
                errCode: 2,
                message: "Missing required parameters",
            };
        }
        let user = await db.User.findOne({
            where: { id: userData.id },
            raw: false,
        });
        if (user) {
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.address = userData.address;
            user.phoneNumber = userData.phoneNumber;

            await user.save();

            return {
                errCode: 0,
                message: "Cập nhật thông tin người dùng thành công!",
            };
        } else {
            return {
                errCode: 1,
                message: "Người dùng không tồn tại!",
            };
        }
    } catch (error) {
        return error;
    }
};

let deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: false,
        });
        if (!user) {
            return {
                errCode: 2,
                message: "Người đùng không tồn tại!",
            };
        }
        await user.destroy();
        return {
            errCode: 0,
            message: "Xóa người dùng thành công!",
        };
    } catch (error) {
        return error;
    }
};

let getAllcodeService = async (typeInput) => {
    try {
        if (!typeInput) {
            return {
                errCode: 1,
                errMessage: "Missing required parameter!",
            };
        } else {
            let res = {};
            let allcode = await db.Allcode.findAll({
                where: { type: typeInput },
                raw: true,
            });
            res.errCode = 0;
            res.data = allcode;
            return res;
        }
    } catch (error) {
        return error;
    }
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllcodeService: getAllcodeService,
};
