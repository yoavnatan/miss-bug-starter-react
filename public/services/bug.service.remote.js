import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + '/remove')
}

function save(bug) {

    const quertStr = '/save?' +
        `_id=${bug._id || ''}&` +
        `title=${bug.ditle}&` +
        `severity=${bug.severity}&` +
        `description=${bug.description || ''}`

    return axios.get(BASE_URL + quertStr)
        .then(res => res.data)
}



function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}