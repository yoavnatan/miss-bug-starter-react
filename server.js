import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = req.query
    console.log(filterBy)
    bugService.query()
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            if (filterBy.sortBy) {
                if (filterBy.sortBy === 'title') {
                    bugs.sort((a, b) => a.title.localeCompare(b.title) * filterBy.sortDir)
                }
                if (filterBy.sortBy === 'severity') {
                    bugs.sort((a, b) => (b.severity - a.severity) * filterBy.sortDir)
                }
                if (filterBy.sortBy === 'createdAt') {
                    bugs.sort((a, b) => (b.createdAt - a.createdAt) * filterBy.sortDir)
                }

            }

            return bugs
        })
        .then(bugs => res.send(bugs))
})

app.put('/api/bug', (req, res) => {
    const { _id, title, description, severity } = req.body //no createdAt here, came from the front
    const bug = { _id, title, description, severity }
    // console.log(bug)


    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.post('/api/bug', (req, res) => {
    const { title, description, severity } = req.body
    const bug = { title, description, severity }

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

app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    bugService
        .remove(bugId)
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


