import db from "../models";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("post crud");
};

let displayGetCRUD = async (req, res) => {
  try {
    let data = await CRUDService.getAllUser();
    return res.render("displayCRUD.ejs", { dataTable: data });
  } catch (error) {
    console.error("Error in displayGetCRUD:", error);
    return res.status(500).send("An error occurred while fetching data.");
  }
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let useData = await CRUDService.getUserInfoById(userId);
    if (useData) {
      res.render("editCRUD.ejs", { userInfo: useData });
    }
  } else {
    return res.send("User not found");
  }
};

let putEditCRUD = async (req, res) => {
  let allUser = await CRUDService.updateUserData(req.body);
  return res.render("displayCRUD.ejs", { dataTable: allUser });
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let allUser = await CRUDService.deleteUserById(userId);
    return res.render("displayCRUD.ejs", { dataTable: allUser });
  } else {
    return res.send("User not found!");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putEditCRUD: putEditCRUD,
  deleteCRUD: deleteCRUD,
};
