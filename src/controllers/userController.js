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
    let id = req.query.id; //type: All or id
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

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json({ message });
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json({ message });
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameters!",
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json({ message });
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
};
