import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
const bcryptjs = require('bcryptjs');


try{
    connect();
}
catch(error){
    console.log("connect() method oh!");
}

// connect()


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        console.log(reqBody);

        //check if user already exists
        var user;

        try{
            const x = await User.findOne({email})
            user=x;
        }
        catch(error){
            console.log("findOne method oh god!", error);
        }
        // const user = await User.findOne({email})

        console.log(1);

        if(user){
            console.log("user already exists.");
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        console.log(2);


        var savedUser;
        try{
            const xx = await newUser.save()
            savedUser=xx;
        }
        catch(error){
            console.log("the user is not saved.", error);
        }

        // const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
        
        


    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}