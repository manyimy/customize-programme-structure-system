const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', (req, res) => {
  res.send({
    token: 'mfTeKB6lHV+0G/Pvj5JviCUSBcuZwclmj8zujLA3qv2rTBGzS4u3hDc/UhWocm09RsHFLNgfECBLN3YPU+NGyTWdNyLD8cv/X0Y+6RYxCHxceaHNWKzrYbUmsxz//MWVb7Qe8BLvuX5RdKhofb0GHDUFEXAagJ9ZiJtFqLuBzGX/svJntWzpKoah2uUoq2kmZMwa/l4vq8sYmhNtD4Wp9A=='
  });
});

app.use(express.static(path.join(__dirname, 'constants')));

app.post('/trimesters', (req, res) => {
  filePath = __dirname + '/constants/trimesters.json';
  console.log(req.body.newData);

  fs.writeFile(filePath, JSON.stringify(req.body.newData), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    res.status(200).send("The file was saved!");
  });
});

app.post('/subjectList', (req, res) => {
  filePath = __dirname + '/constants/subjectList.json';
  console.log(req.body.subjects);

  fs.writeFile(filePath, JSON.stringify(req.body.subjects), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    res.status(200).send("The file was saved!");
  });
});

app.post('/standardPS', (req, res) => {
  const { newPS } = req.body;
  filePath = __dirname + '/constants/standardPS.json';
  console.log(req.body.newPS);

  fs.writeFile(filePath, JSON.stringify(req.body.newPS), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    res.status(200).send("The file was saved!");
  });
});

app.get('/hi', (req, res) => {
  res.send("Hello World")
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Listing on port 5000");
});
