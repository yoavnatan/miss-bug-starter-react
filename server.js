import express from 'express'
import cookieParser from 'cookie-parser'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


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
    const visitedBugs = req.cookies.visitedBugs || []
    const bugId = req.params.id
    if (visitedBugs.every(id => id !== bugId) && visitedBugs.length < 3) visitedBugs.push(bugId)
    else if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
    console.log('User visited at the following bugs: ', visitedBugs)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7_000 })

    bugService
        .getById(bugId)
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