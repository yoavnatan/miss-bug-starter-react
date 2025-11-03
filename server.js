import express from 'express'
import { bugService } from './services/bug.service.js'
const app = express()
app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})