const express = require("express");
const app = express();
const path =  require("path");
const hbs = require("hbs");
require("./db/conn"); 
const Register = require("./models/registers");
const { json } = require("express");
const bcrypt =require('bcryptjs');

const PORT  = process.env.PORT ||  3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "hbs"); 
const middleware  = (req, res, next)=>{
  res.send(`Action Prohibited`);
  //next();
}
app.get("/", (req, res) =>{
    res.render("register");
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/signin", (req, res)=>{
  res.render("register");
});

app.post("/register", async(req, res)=>{
  try{ 
    const password = req.body.password;
    const cpassword = req.body.password;
    const useremailll = await Register.findOne({email:req.body.email});
    if(useremailll){
      res.send("Email Already Exists!!");
    }
    if(password === cpassword){
      const registerEmployee = new Register({
        name : req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        linkedin: req.body.linkedin,
        password: req.body.password
      })
      //console.log(registerEmployee);
      const token = await registerEmployee.generateAuthToken();

      //console.log(registerEmployee);
      const registered =  await registerEmployee.save();
      res.status(201).render("index",{name:registerEmployee.name,email:registerEmployee.email,linkedin:registerEmployee.linkedin});
    }else{
      res.send("paswords are not matching")
    }
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.post("/signin", async(req, res)=>{
  try{
      const email = req.body.email;
      const password =  req.body.password;
      //console.log(`${email} and password ${password}`);
      const useremail = await Register.findOne({email:email});
      //console.log(useremail);
      const username=useremail.name;
      const userlinkedin=useremail.linkedin;
      const isMatch = bcrypt.compare(password, useremail.password);
      const token = await useremail.generateAuthToken();
      // console.log(token); 
      if(isMatch){
        res.status(201).render("index1",{name: username,email:useremail.email,linkedin:userlinkedin});
      }
      else{
        res.send("password are not matching");
      }
  } catch(error){
      res.status(400).send(error);
  }
});

app.listen(PORT, ()=> {
  console.log(`server running at port no ${PORT}`);
}); 