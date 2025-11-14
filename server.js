import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import PDFDocument from 'pdfkit'



import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'



const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.set('query parser', 'extended')

app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)
    console.log(queryOptions)
    bugService.query(queryOptions)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }

    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
        paginationOn: queryParams.paginationOn
    }

    return { filterBy, sortBy, pagination }
}


app.get('/api/bug/:id', (req, res) => {
    const { visitedBugs = [] } = req.cookies
    const { id: bugId } = req.params

    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    else if (visitedBugs.length > 3) return res.status(429).send('Wait for a bit')
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7_000 })

    bugService
        .getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.post('/api/bug', (req, res) => {
    const bug = { // must be explicit
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        labels: req.body.labels || []
    }

    if (!bug.title || bug.severity === undefined) return res.status(400).send('Missing required fields')

    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })

})

app.put('/api/bug/:id', (req, res) => {
    const { _id, title, description, severity } = req.body //no createdAt here, came from the front

    if (!_id || !title || severity === undefined) return res.status(400).send('Missing required fields')
    const bug = { _id, title, description, severity: +severity, labels: labels || [] }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
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

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.post('/api/bug/pdf', (req, res) => {
    const bugs = req.body
    const doc = new PDFDocument()

    // שליחה ישירות ללקוח
    res.setHeader('Content-Type', 'application/pdf')

    doc.pipe(res)

    bugs.forEach(bug => {
        doc.text(`Bug ID: ${bug._id}`)
        doc.text(`Title: ${bug.title}`)
        doc.text(`Description: ${bug.description}`)
        doc.text(`Severity: ${bug.severity}`)
        doc.addPage()
    })

    doc.end()
})



const port = 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})


