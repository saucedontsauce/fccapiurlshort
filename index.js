require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const dns = require('dns')
const fs = require('fs');
//const bfstore 
const store = require('./backup.json') //= JSON.parse(bfstore.toString())
// class
class Shortener {
  constructor(url) {
    this['original_url'] = url
    this.generate()
  }
  generate() {
    let prevkeys = Object.keys(store.urls)
    let newid = crypto.randomUUID()
    if (prevkeys.indexOf(newid) < 0) {
      this.short_url = newid
    } else {
      newid = crypto.randomUUID()
    }

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

app.get('/api/shorturl/:id', (req, res) => {
  let id = req.params.id
  if(!store.urls[id]){
 res.send('Shortener does not exist')
  }else {
     let orig = store.urls[id].original_url
  res.redirect(orig)
  }
 
})

app.post('/api/shorturl', (req, res) => {
  let data = req.body
  let url
  dns.lookup(data, (err,addr)=>{
    if(err){
      res.json({error:'Invalid url'})
    } else {

      let prdata = { ...store }
      let nob = new Shortener(url.href)
      prdata.urls[nob.short_url] = nob
      let bf = Buffer.from(JSON.stringify(prdata))
      fs.writeFile('backup.json', bf, (err) => {
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
