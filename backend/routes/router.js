// routes/admin.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleWare/adminAuth");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
router.get("/admin", adminAuth, (req, res) => {
    res.sendFile("../../assets/templates/admin.html");
});


router.get("/api/admin/data", adminAuth, (req, res) => {
    res.json({ data: "Data cannot be provided" });
});

module.exports = router;
