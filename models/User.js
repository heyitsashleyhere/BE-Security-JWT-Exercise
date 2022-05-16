import mongoose from "mongoose";

const unique = true
const required = true

const UserSchema = new mongoose.Schema({
    username: {type: String, required, unique},
    password: {type: String, required}
})

const User = mongoose.model('user', UserSchema) //create the model
export default User