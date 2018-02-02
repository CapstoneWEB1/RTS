const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

//setup express and body parser for posting
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

//start on port 3001
app.set('port', 3001);

//get homepage acessing index.html
app.get('/', (req, res) => {
	res.sendFile('index.html', {root: path.join(__dirname, '../client')});
});

//listen on specified port
app.listen(app.get('port'), () => {
  console.log(`Server started at http://localhost:${app.get('port')}/`);
});


