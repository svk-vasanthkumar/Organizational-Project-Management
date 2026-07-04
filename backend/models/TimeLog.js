const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
{
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",
        required:true
    },

    assignmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProjectAssignment",
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
        required:true,
        min:1
    },

    notes:{
        type:String,
        trim:true,
        default:""
    }
},
{
    timestamps:true,
    toJSON:{ virtuals:true },
    toObject:{ virtuals:true }
});

// Prevent duplicate logs for same task/member/date
timeLogSchema.index({
    taskId:1,
    memberId:1,
    date:1
});

module.exports = mongoose.model("TimeLog", timeLogSchema);