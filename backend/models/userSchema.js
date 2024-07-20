import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: [true,"Name Required"]
    },
    email:{
        type: String,
        required:[true,"EmailRequired"],
    },
    phone:{
        type: String,
        required:[true,"Phone number required"],
    },
    aboutMe:{
        type:String,
        required:[true,"About Me Must Required"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[8,"Password should be 8 characteter"],
        select: false,
    },
    avatar:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    resume:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    portfolioURL:{
        type: String,
        required: [true,"Portfolio Required"]
    },
    githubURL: String,
    instagramURL: String,
    twitterURL: String,
    linkedinURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
    });
};


export const User=  mongoose.model("User", userSchema);