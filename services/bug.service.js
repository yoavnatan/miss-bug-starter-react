import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const bugs = readJsonFile('./data/bug.json')

function query() {
    return Promise.resolve(bugs)
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
        bugs.push(bug)
    }
    return _savebugs()
        .then(() => bug)
}

function _savebugs() {
    return writeJsonFile('./data/bug.json', bugs)
}