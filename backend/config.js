const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;

// Connect MongoDB at default port 27017.
mongoose.connect(DB_URL,{}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});
