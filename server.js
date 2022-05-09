import express from 'express'
import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { hash } from './lib/crypto.js'
// Provide a Connect/Express middleware that can be used to enable Cross-Origin Resource Sharing with various options
import cors from 'cors'


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const secret = process.env.SECRET

// imagine this as my backend DB:
let users= [
    { userId: "1", username: "Chicken", password:"nekcihc" },
    { userId: "2", username: "Dog",     password:"god" },
    { userId: "3", username: "Cat",     password:"tac" },
    { userId: "4", username: "Cow",     password:"woc" },
    { userId: "5", username: "Fish",    password: "hsif"}
]

// User can login
function checkUser(req, res, next) {
    const user = users.find( u => req.body.username === u.username && req.body.password === u.password)
    if (user) {
        return next()
    }
    res.status(404).send("Invalid User")
}
// User can register: username is unique
function checkUsernameIsUnique(req, res, next) {
    const isNotUnique = users.find( u => req.body.username === u.username)
    if(isNotUnique) {
        return res.status(406).send("Username already exist")
    }
    next()
}


app.get("/users", (req, res) => {
    res.send(users)
})


// 1. Convert the /token endpoint to a /login endpoint
app.post("/login", checkUser, (req, res) => {
    const payload = req.body
    const options = {
        expiresIn: process.env.TOKEN_EXP_TIME
    }

    const token = jsonwebtoken.sign(payload, secret, options)
    return res.status(200).send(token)
})

// 2. Add registration
app.post("/register", checkUsernameIsUnique, async (req, res) => {
    const hashed = await hash(req.body.password)
    const newUser = {
        userId: uuidv4(), 
        userName: req.body.username,
        password: hashed
    }

    users.push(newUser)
    return res.status(200).send("User registered")
})


app.listen(process.env.PORT, () => console.log("Listing on http://localhost:" + process.env.PORT))