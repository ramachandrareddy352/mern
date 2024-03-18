const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express();
const port = 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// app.get('/api/signup', (req, res) => {
//     res.send('Hello World signup!')
// })
// app.get('/api/login', (req, res) => {
//     res.send('Hello World login!')
// })
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`app is listening at http://127.0.0.1:${port}`)
})