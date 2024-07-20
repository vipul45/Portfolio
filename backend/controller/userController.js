import {} from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../middlewares/error.js";
import {User } from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";

export const register = catchAsyncErrors(async (req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new Errorhandler("Avatar and resume are required", 400));
    }
    const {avatar, resume} = req.files;
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder:"AVATARS"}
    );
    if(!cloudinaryResponseForAvatar.error || cloudinaryResponseForAvatar.error){
        console.error(
            "Cloudinary Error:",
            cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error" 
        );
    }
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder:"RESUME"}
    );
    if(!cloudinaryResponseForResume.error || cloudinaryResponseForResume.error){
        console.error(
            "Cloudinary Error:",
            cloudinaryResponseForResume.error || "Unknown Cloudinary Error" 
        );
    }
    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        linkedinURL
    } = res.body;
    const user = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        linkedinURL,
        avatar:{
            public_id:cloudinaryResponseForAvatar.public_id,
            url:cloudinaryResponseForAvatar.secure_url,
        },
        resume:{
            public_id:cloudinaryResponseForResume.public_id,
            url:cloudinaryResponseForresume.secure_url,
        }
    });
    res.status(200).json({
        success: true,
        message: "User Registered",
    });

});