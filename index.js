const express = require('express')
const app = express()
const path = require('path')
const fs = require('node:fs')


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    fs.readdir(`./file`, (err, file) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Internal Server Error");
        }

        res.render("index", { files : file }); 
    })

})

app.post("/create",(req,res)=>{
    fs.writeFile(`./file/${req.body.title.split(" ").join("")}.txt`,req.body.details,(err)=>{
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error saving the task");
        }
        res.redirect("/")
    })
});

app.post("/delete/:filename",(req,res)=>{
    fs.unlink(`./file/${req.params.filename}`,(err)=>{
        if(err){
            console.error("Error deleting file:", err);
            return;
        }
        res.redirect("/")
    })
})

app.get("/file/:filename",(req,res)=>{
    fs.readFile(`./file/${req.params.filename}`,"utf-8",(err,data)=>{
        res.render('show',{data:data,filename:req.params.filename},);
    })
});

app.get("/edit/:filename",(req,res)=>{
   res.render('edit',{filename:req.params.filename});
});


app.post("/edit",(req,res)=>{
    fs.rename(`./file/${req.body.prev}`,`./file/${req.body.new.split(" ").join("")}.txt`,(err)=>{
        if(err){
            console.log(err);
        }
    })
    fs.writeFile(`./file/${req.body.prev}`,req.body.data,(err)=>{
        if(err){
            console.log(err);

        }
        res.redirect("/");
    })
})
// console.log("hello")

app.listen(3000)
