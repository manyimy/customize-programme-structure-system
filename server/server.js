const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.use('/login', (req, res) => {
  res.send({
    token: 'mfTeKB6lHV+0G/Pvj5JviCUSBcuZwclmj8zujLA3qv2rTBGzS4u3hDc/UhWocm09RsHFLNgfECBLN3YPU+NGyTWdNyLD8cv/X0Y+6RYxCHxceaHNWKzrYbUmsxz//MWVb7Qe8BLvuX5RdKhofb0GHDUFEXAagJ9ZiJtFqLuBzGX/svJntWzpKoah2uUoq2kmZMwa/l4vq8sYmhNtD4Wp9A=='
  });
});

app.get("/", (req, res, next) => {
  res.send("Civil management");
});

app.listen(4000, () => {
  console.log("Listing on port 4000");
});
