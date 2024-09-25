const express = require('express');
const URL = require('../models/url'); // Import the URL model

const router = express.Router();

router.get("/", async (req, res) => {
    const allurls = await URL.find({})
    return res.render("home", {
        urls: allurls,
    });
})

module.exports = router;