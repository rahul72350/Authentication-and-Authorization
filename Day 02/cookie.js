require("dotenv").config();
const express = require('express')
const cookie = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookie());


app.post('/login',(req,res)=>{
    const {email, password} = req.body;

    const isValid = email === 'rahulthakur@gmail.com' && password === '1234'

    if(!isValid){
        return res.status(400).json({message: 'invalid credential'});
    }

    res.cookie('user_id','10',{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        maxAge: 1000 * 60 * 60 * 24
    })
    res.status(200).json({message:'login succesfully'});
})


app.get('/dashboard',(req,res)=>{
    const user_id = req.cookies.user_id;

    if(user_id !== '10'){
        return res.json({message:"you need to login first"});
    }

    res.json({message:"this is dashboard section"});
})

app.post('/logout',(req,res)=>{
    res.clearCookie('user_id');
    res.json({message:"user logged out"});
})


app.listen(PORT,()=>{
    console.log('app is running on http://localhost:3000');
})