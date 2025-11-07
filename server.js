import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))


app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/save', (req, res) => {
    const { id: _id, title, description, severity } = req.query //no createdAt here, came from the front
    const bug = { _id, title, description, severity: +severity }
    // console.log(bug)

    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})


app.get('/api/bug/:id', (req, res) => {
    console.log('hi')
    const bugId = req.params.id
    console.log(bugId)
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.get('/api/bug/:id/remove', (req, res) => {
    const bugId = req.params.id

    bugService.remove(bugId)
        .then(() => res.send('Bug Removed'))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

const port = 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})