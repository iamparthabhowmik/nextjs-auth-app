import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
const bcryptjs = require('bcryptjs');

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


    }
    catch(error: any){
        return NextResponse.json({error: error.message},{status: 500});
    }
}