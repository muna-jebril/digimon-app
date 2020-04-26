'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const PORT = process.env.PORT ;
 const client= new pg.Client(process.env.DATABASE_URL);
 app.use(express.urlencoded({ extended: true }));
 app.use(express.static('./public')); 
 app.set('view engine', 'ejs');
 
//  app.use(methodOverride('_method'));

app.use('/',(req,res)=>{
    res.render('index');
})
app.use('/new',(req,res)=>{
    res.redirect('new');
})

app.use('/show', (req,res)=>{
    fffff
     let url= 'https://digimon-api.herokuapp.com/api/digimon';
     console.log(url)
          superagent.get(url)
     .then(data=>{
         console.log(data,"aaa");
         let digimonData = data.body.items ; 
         let digimonArr= digimonData.map(value=>{
             let digimonOBJ= new Digimon(value);
             return digimonOBJ;
         })
         res.render('/searches/show',{result:digimonArr});
     })

})
app.post ('/add',(req,res)=>{
    let {name,level,img}= req.body;
    let SQl = "INSERT INTO bokemon (name,level,img) VALUES ($1,$2,$3);"
    let safeValues= [name,level,img];
    superagent.get(SQl,safeValues)
    .then (()=>{
        res.render('pages/add');
    })
})
app.post ('/fav', (req,res)=>{
    let SQl= 'SELECT * FROM bokemon;'
    client.query(SQl)
    .then (data=>{  
        res.render('pages/fav',{results:data.rows});
    })
})

app.get('/detail:id',(req,res)=>{
    let sql = 'SELECT * FROM bokemon WHERE id=$1';
    safeValues= [req.params.id];
    client.query(sql,safeValues)
    .then (result =>{
        res.render('pages/fav' ,{bokem:result})
    })
})

function  Digimon(value){
    this.name =value.name;
    this.img= value.img;
    this.level= value.level;
}

app.use('*',(req,res)=>{
    app.status (500).send ("this route diesnt exitras ");


})
app.use(Error,(req,res)=>{
    app.status (404).send (Error);

})
client.connect()
.then ( ()=>{
    app.listen(PORT,()=>{
        console.log(`lisnting to port ${PORT}`);

    })
})