const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

mongoose.connect("mongodb://localhost:27017")

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
 res.send("Hello Gagan!");
});

app.post("/signup", async function(req, res) {
   try{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash(password,salt);


    await UserModel.create({
        email: email,
        password: userPassword,
        name: name
    });
    
    res.json({
        message: "You are signed up"
    })
   }catch(err){

    if (err.code === 11000) {
        // Duplicate email error
        res.status(409).json({
            message: "Email already in use"
        });
    } else {
        res.status(500).json({
            message: "Error signing up",
            error: err.message
        })}
}
});


app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await UserModel.findOne({email: email});
    const response = user && await bcrypt.compare(password, user.password);

    if (response) {
        const token = jwt.sign({
            id: user._id.toString(),
          
        
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});


app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    })
});


app.put("/todo/:id/done", auth, async (req, res) => {
    const todoId = req.params.id;
    const updatedTodo = await TodoModel.findByIdAndUpdate(todoId, { done: true }, { new: true });

        if (updatedTodo) {
            res.json({ message: "Todo marked as done", todo: updatedTodo });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }

});


app.listen(3000);