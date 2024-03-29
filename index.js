require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const dns = require('dns')
const fs = require('fs');
//const bfstore 
let data =  fs.readFileSync('backup')
const storedata = JSON.parse(atob(data))


// class
class Shortener {
  constructor(url) {
    this['original_url'] = url
    this['short_url'] = storedata.urls.length
  }

}


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:id', function (req, res){
  let id = req.params.id
  if(!storedata.urls[id]){
 res.send('Shortener does not exist')
  }else {
     let orig = storedata.urls[id].original_url
  res.redirect(orig)
  }
 
})

app.post('/api/shorturl', function (req, res) {
  let data = new URL(req.body.url)
  dns.lookup(data.hostname, (err,addr)=>{
    if(err){
      console.log('err',err)
      res.json({error:'Invalid url'})
    } else {
      let prdata = { ...storedata }
      let nob = new Shortener(data.href)
      console.log(data)
      prdata.urls.push(nob) 
      let bf = btoa(JSON.stringify(prdata))
      fs.writeFile('backup', bf, (err) => {
        if (err) {
          res.send('write error' + err)
        }
        res.send(nob)
      })
      
    }
  })

 


})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
