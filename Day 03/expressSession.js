const express = require('express');
const app = express();
const session = require('express-session');


app.use(express.json());
app.use(session({
    secret: 'mysecretkey',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
    }
}));


// fake user
const users = [
  { id: 1, email: 'user@test.com', password: '1234' }
]


app.post('/register',(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password) return res.json({message:'invalid credentials'});

    let id = users.length + 1;
    const new_user = {id, email,password};
    users.push(new_user);
    res.json({message:"user registered succesfully"});
})



app.post('/login',(req,res)=>{
    console.log(req.body);
    const {email,password} = req.body;
    const user = users.find(u=>u.email === email && u.password === password);
    if(!user){
        return res.json('invalid credentials');
    }

    req.session.userid = user.id;
    req.session.email = user.email;

    res.json({message:'user logged in succesfully'});
})


app.get('/dashboard',(req,res)=>{

    if(!req.session.userid){
        return res.json({message:'user not logged in'});
    }

    console.log(req.session.id);
    console.log(`welcome ${req.session.email}`);
    res.json({message:`welcome ${req.session.email}`});
})

app.post('/logout',(req,res)=>{
    if(!req.session.userid){
        return res.json({message:'invalid credential'});
    }

    req.session.destroy((err)=>{
        res.clearCookie('sid');
        res.json({message:'user logged out succesfully'});
    })
})

app.listen(3000,()=>{
    console.log('app is running on http://localhost:3000');
})