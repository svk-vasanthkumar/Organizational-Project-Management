const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
{
    memberId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TeamMember",
        required:true
    },

    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },

    score:{
        type:Number,
        required:true
    },

    statusTag:{
        type:String,
        enum:[
            "Exceeding",
            "On Track",
            "Lagging",
            "Critical"
        ],
        required:true
    }

},
{
timestamps:true
});

module.exports=mongoose.model(
"PerformanceRecord",
performanceSchema
);