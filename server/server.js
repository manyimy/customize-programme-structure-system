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


// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.get("/", (req, res, next) => {
//   res.send("Civil management");
// });

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

app.post('/subjectLists', (req, res) => {
  filePath = __dirname + '/constants/subjectLists.json';
  console.log(req.body.subjects);

  fs.writeFile(filePath, JSON.stringify(req.body.subjects), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    res.status(200).send("The file was saved!");
  });
});

app.listen(4000, () => {
  console.log("Listing on port 4000");
});
