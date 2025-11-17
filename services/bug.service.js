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

function query({ filterBy, sortBy, pagination }) {
    let filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        pagination.pageIdx = 0
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels.length > 0) {
        filteredBugs = filteredBugs.filter(bug => {
            return filterBy.labels.every(fLabel => {
                return bug.labels.some(label => label === fLabel)
            })
        })

    }

    if (sortBy) {
        // filterBy.pageIdx = 0

        if (sortBy.sortField === 'severity' || sortBy.sortField === 'createdAt') {
            const { sortField } = sortBy

            filteredBugs.sort((bug1, bug2) =>
                (bug1[sortField] - bug2[sortField]) * sortBy.sortDir)
        } else if (sortBy.sortField === 'title') {
            filteredBugs.sort((bug1, bug2) =>
                (bug1.title.localeCompare(bug2.title)) * sortBy.sortDir)
        }
    }

    if (pagination.paginationOn === 'true' && pagination.pageIdx !== undefined) {
        console.log(pagination.paginationOn)
        const { pageIdx, pageSize } = pagination

        const startIdx = pageIdx * pageSize
        filteredBugs = filteredBugs.slice(startIdx, startIdx + pageSize)
    }

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('bug not found')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('bug not found')

    if (bugs[idx].creator._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }

    bugs.splice(idx, 1)
    return _savebugs()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        if (bugToUpdate.creator._id !== loggedinUser._id) {
            return Promise.reject('Not your bug')
        }
        bugToUpdate.labels = bug.labels
        bugToUpdate.createdAt = bug.createdAt
        bugToUpdate.title = bug.title
        bugToUpdate.severity = bug.severity

        // const idx = bugs.findIndex(b => b._id === bug._id)
        // if (idx === -1) return Promise.reject('bug not found')
        // bugs[idx] = { ...bug[idx], ...bug } //patch --- because there is no createdAt at the saved bug that came from the front
    } else {
        bug._id = makeId()
        bug.createdAt = Date.now()
        bug.labels = ['critical']
        bug.creator = loggedinUser
        bugs.unshift(bug)
    }
    return _savebugs()
        .then(() => bug)
}

function _savebugs() {
    return writeJsonFile('./data/bug.json', bugs)
}

