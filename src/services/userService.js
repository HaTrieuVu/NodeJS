const db = require("../models");
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);

            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password"],
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

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
};
