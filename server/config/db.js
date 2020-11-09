const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log("MONGO_DB Connected", con.connection.host);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB