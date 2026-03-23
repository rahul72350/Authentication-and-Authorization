
require("dotenv").config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());


const users = [];  //in memory storage


app.post('register',(req,res)=>{
    const {email, password} = req.body;

    const user = users.find(user=> user.email === email);

    if(user.email) return res.status(404).json({
        message:'email already existed'
    })

    let id = users.length++;
    const new_user = {id,email,password};
    users.push(new_user);
    res.status(201).json({message:"user created successfully"});
})

app.post('login',(req,res)=>{
    const {email, password} = req.body;
    const user = users.find(user=> user.email === email);

    if(!user) return res.status(400).json({error:"invalid credentials"});
    if(user.password !== password) return res.status(400).json({error:"invalid credentail"});

    //at this stage user verified
    //but as of now we didn't learn sesssion or jwt to remember the user so we can't remember the state of user
    res.status(200).json({message:'login succesfully but we lost you'});
})

app.listen(PORT,()=>{
    console.log("app is running on http://localhost:3000");
})







