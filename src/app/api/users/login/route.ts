import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

connect();

export async function POST(request:NextRequest) {
    try{
        const reqbody = await request.json();
        const {email, password} = reqbody;
        console.log(reqbody);

        // check if user exists or not
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "user does not exists"},{status: 400});
        }

        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);

        if(!validPassword){
            return NextResponse.json({error: "Invalide Password!"}, {status: 400});
        }

        // create token data
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        };

        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"});

        const responce = NextResponse.json({
            message: "Login successful",
            success: true
        })
        responce.cookies.set("token", token, {
            httpOnly: true
        })

        return responce;
    }
    catch(error: any){
        return NextResponse.json({error: error.message},{status: 500});
    }
}