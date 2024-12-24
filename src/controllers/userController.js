const userService = require("../services/userService");

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter!",
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    // check email co exist k
    // compare password
    // return userInfor
    // access_token (JWT- json web token)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {},
    });
};

let handleGetAllUser = async (req, res) => {
    let id = req.body.id; //type: All or id
    let user = await userService.getAllUser(id);

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameters",
            user: [],
        });
    }

    return res.status(200).json({
        errCode: 0,
        message: "Ok",
        user,
    });
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
};
