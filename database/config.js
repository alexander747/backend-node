// user mean_user
// password DB7MYxwWOAl7XCbX

const mongoose = require('mongoose');

const dbConection = async()=>{
    

     try {
        mongoose.connect( process.env.DB_CNN , {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useCreateIndex:true
     });     
     console.log("db conectada");
     } catch (error) {
        console.log(error);
        throw new Error('Error Conexion bd');
     }


}

module.exports = {
    dbConection
}