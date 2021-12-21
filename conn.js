const mongoose= require('mongoose')

mongoose.connect("mongodb://localhost:27017/Hubspot")
.then(()=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log("not connected")
})
const tokenSchema= new mongoose.Schema({
    refreshToken:{
        type:String
    }
})
const detailSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required : true
    },
    lastName:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required : true
    },
    id:{
        type:Number,
        required:true
    }

})

//collection creation
const EnterDetail = mongoose.model("Detail", detailSchema)
const Token=  mongoose.model("RefreshToken",tokenSchema)

module.exports= {EnterDetail,Token}

