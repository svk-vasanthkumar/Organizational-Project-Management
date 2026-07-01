const mongoose = require("mongoose");

const breachLogSchema = new mongoose.Schema(
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

    originalDeadline:{
        type:Date,
        required:true
    },

    revisedDeadline:{
        type:Date,
        required:true
    },

    reason:{
        type:String,
        required:true
    }

},
{
timestamps:true
});

module.exports=mongoose.model(
"BreachLog",
breachLogSchema
);