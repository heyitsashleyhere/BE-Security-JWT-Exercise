import mongoose from "mongoose";

function connect() {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env
    const connStr = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`

    const { connection } = mongoose
    connection.on("connecting",      () => console.log("[MDB] connecting"))
    connection.on("connected",       () => console.log("[MDB] connected"))
    connection.on("disconnecting",   () => console.log("[MDB] disconnecting"))
    connection.on("disconnected",    () => console.log("[MDB] disconnected"))
    connection.on("reconnected",     () => console.log("[MDB] reconnected"))
    connection.on("error",           error => console.log("[MDB] error", error))

    mongoose.connect(connStr)
}

export default connect