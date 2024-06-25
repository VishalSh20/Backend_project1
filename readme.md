This is our starting backend project

[Notes-]
Use of IIFE in DB Connection
```javascript
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error: ",error);
        })

        app.listen(process.env.PORT,()=>{
            console.log("App Listening on ",process.env.PORT);
        })

    } catch (error) {
        console.error("Error in Connection",error);
    }
})()
```