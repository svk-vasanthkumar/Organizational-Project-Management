const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
{
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",
        required:true
    },

    memberId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TeamMember",
        required:true
    },

    date:{
        type:Date,
        required:true
    },

    hoursLogged:{
        type:Number,
        required:true
    },

    notes:{
        type:String
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("TimeLog",timeLogSchema);