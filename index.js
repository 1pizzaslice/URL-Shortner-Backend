require('dotenv').config();

const express = require('express');
const path = require('path');

const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const URL = require('./models/url');
const app = express();
const PORT = process.env.PORT || 8000;
//'mongodb://localhost:27017/short-url'
connectToMongoDB(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use('/url', urlRoute);
app.use('/', staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory:  {timestamp: Date.now()},
            },
        }
    );
    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
