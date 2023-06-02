const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/check_installation", controller.checkInstallation);
router.get("/get_user", controller.getUser);
router.get("/get_repos", controller.getRepos);
router.post("/mail", controller.sendMail);

module.exports = {router};
