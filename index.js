const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes'));

//connect to db with mongoose
mongoose.connect('mongodb+srv://bankUser:usingBank1234@bank.dxiq1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("database connected")
});


app.use((req, res)=> {
    res
    .status(404)
    .send("Unknown request");
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`application start at ${process.env.PORT || 5000}`)
})
