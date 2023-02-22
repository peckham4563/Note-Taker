const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001
const path = require ('path')
const fs = require ('fs')
const util = require ('util')
const readfile = util.promisify (fs.readFile)
const writefile = util.promisify (fs.writeFile)
const {
  v4:uuidv4
} = require('uuid')
const getNotes = () => {
  return readfile('db/db.json', 'utf8').then (rawnotes => [].concat(JSON.parse(rawnotes)))
}

//middleware
app.use(express.json())
app.use(express.urlencoded({
  extended:false
}))
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
  });
  
  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname,'./public/notes.html'));
  });
  
  // app.get("*", (req, res) => {
  //   res.sendFile( "/public/index.html");
  // });
  app.get('/api/notes',(req, res) => {
    getNotes().then(notes => res.json(notes)).catch(err => res.json(err))
  })
  app.post('/api/notes',(req, res) => {
    getNotes().then(oldNotes => {
      // console.log(oldNotes)
      // console.log(req.body)
      const newNotes = [...oldNotes,{
        title:req.body.title,text:req.body.text,id:uuidv4()
      }]
      writefile('db/db.json',JSON.stringify(newNotes)).then(()=>res.json({
        msg:'Ok'
      })).catch(err => res.json(err))
    })
  })

  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });

