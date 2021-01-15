const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.sendFile();
// });

app.use(express.static(path.join(__dirname, "../website")));


app.listen(PORT, ( () => console.log(`Server started on port ${PORT}`)));