//build session manually

const express = require('express');
const crypto = require('crypto');
const app = express();
const cookie = require('cookie-parser');


app.use(express.json());
app.use(cookie());


const session = {};


//create session
function createSession(data){
    const sessionId = crypto.randomBytes(16).toString('hex');
    session[sessionId] = data;
    return sessionId;
}

//get session
function getSession(sessionId){
    return session[sessionId] || null;
}

//delete session
function destroySession(sessionId){
    delete session[sessionId];
}


const users = [{ id: 1, email: 'user@test.com', password: '1234' }]


app.post('/login',(req,res)=>{
    const {email,password} = req.body;

    const user = users.find(u=>u.email === email && u.password === password);

    if(!user) return res.json({message:'invalid credential'});

    const sessionId = createSession({ userId: user.id, email: user.email });

    res.cookie('sid',sessionId,{httpOnly:true})

    console.log('Session store right now:', session)
  // → { "a3f9k2x...": { userId: 1, email: "user@test.com" } }

    res.json({message:'user logged in succesfully'});
})


app.get('/dashboard',(req,res)=>{
    const sid = req.cookies.sid;

    const existence = getSession(sid);

    if(!existence){
        return res.json({message:'first you need to login'});
    }

    res.json({message:'dashboard rendered'});
})

app.post('/logout',(req,res)=>{
    const sid = req.cookies.sid;
    const existence = getSession(sid);
    if(!existence){
        return res.json({message:'you are not logged in'});
    }

    destroySession(sid);
    res.clearCookie('sid');
    res.json({message:'user logged out succesfully'});
})

app.listen(3000,()=>{
    console.log('app is running on http://localhost:3000');
})