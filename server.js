import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors' // Provide a Connect/Express middleware that can be used to enable Cross-Origin Resource Sharing with various options
import jsonwebtoken from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { hash, compareHashes } from './lib/crypto.js'
import connect from './lib/database.js'
import User from './models/User.js'


dotenv.config()
connect()
const app = express()
app.use(cors())
app.use(express.json())

const secret = process.env.SECRET

// imagine this as my backend DB:
// let users= []

// User can login
async function checkUser(req, res, next) {
    // const user = users.find( u => req.body.username === u.username && compareHashes(req.body.password, u.password) )
    const user = await User.findOne({username: req.body.username})
    if (!user) { 
        return res.status(404).send({error: "Invalid User"})
    } 
    const validUser = await compareHashes(req.body.password, user.password)
    if (!validUser) {
        return res.status(404).send({error: "Invalid Password"})
    }
    next()
}
// User can register: username is unique
function checkUsernameIsUnique(req, res, next) {
    const isNotUnique = users.find( u => req.body.username === u.username)
    if(isNotUnique) {
        return res.status(406).send({message: "Username already exist"})
    }
    next()
}


app.get("/users", async (req, res) => {
    const users = await User.find()
    res.send(users)
})


// 1. Convert the /token endpoint to a /login endpoint
app.post("/login", checkUser, (req, res) => {
    const payload = req.body
    const options = {
        expiresIn: process.env.TOKEN_EXP_TIME
    }

    const token = jsonwebtoken.sign(payload, secret, options)
    return res.status(200).send({token}) // always send back an OBJECT!
})

// 2. Add registration 
// takeout: checkUsernameIsUnique (it was before I added mongoDB)
app.post("/register", async (req, res) => {
    const hashed = await hash(req.body.password)
    // const newUser = {
    //     userId: uuidv4(), 
    //     username: req.body.username,
    //     password: hashed
    // }

    const newUser = {
        username: req.body.username,
        password: hashed
    }
    // users.push(newUser)
    try {
        await User.create(newUser)
        res.status(200).send({message: "User registered"})
    } catch (error) {
        res.status(400).send({error: "Username already exist"});
    }
    
})


app.listen(process.env.PORT, () => console.log("Listing on http://localhost:" + process.env.PORT))