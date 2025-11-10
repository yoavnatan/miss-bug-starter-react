import { makeId, readJsonFile, writeJsonFile } from './util.service.js'
import fs from 'fs'
import PDFDocument from 'pdfkit-table'


export const bugService = {
    query,
    getById,
    remove,
    save
}
const PAGE_SIZE = 3
const bugs = readJsonFile('./data/bug.json')

function query(filterBy = {}) {
    let filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'title') {
            filteredBugs.sort((a, b) => a.title.localeCompare(b.title) * filterBy.sortDir)
        }
        if (filterBy.sortBy === 'severity') {
            filteredBugs.sort((a, b) => (b.severity - a.severity) * filterBy.sortDir)
        }
        if (filterBy.sortBy === 'createdAt') {
            filteredBugs.sort((a, b) => (b.createdAt - a.createdAt) * filterBy.sortDir)
        }

    }

    if (filterBy.paginationOn) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        const endIdx = startIdx + PAGE_SIZE

        filteredBugs = filteredBugs.slice(startIdx, endIdx)
    }

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('bug not found')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)

    if (idx === -1) return Promise.reject('bug not found')
    bugs.splice(idx, 1)

    return _savebugs()
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(b => b._id === bug._id)
        if (idx === -1) return Promise.reject('bug not found')
        bugs[idx] = { ...bug[idx], ...bug } //patch --- because there is no createdAt at the saved bug that came from the front
    } else {
        bug._id = makeId()
        bug.createdAt = Date.now()
        bug.labales = ['critical']
        bugs.push(bug)
    }
    return _savebugs()
        .then(() => bug)
}

function _savebugs() {
    return writeJsonFile('./data/bug.json', bugs)
}

