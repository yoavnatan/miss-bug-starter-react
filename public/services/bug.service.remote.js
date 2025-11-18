import { utilService } from './util.service.js'
import { showErrorMsg } from './event-bus.service.js'
// import { download } from '../../services/util.service.js'
import { pdfService } from '../../services/pdf.service.js'

import fs from 'fs'
import PDFDocument from 'pdfkit-table'

const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    downloadPDF,
    getLabels,
    getUserBugs
}

function query(queryOptions = {}) {
    return axios.get(BASE_URL, { params: queryOptions })
        .then(res => res.data)

}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
        .catch(err => showErrorMsg(`${err.response.data}`, err))

}

function remove(bugId) {
    return axios.delete(BASE_URL + '/' + bugId)
}

function save(bug) {

    if (bug._id) {
        return axios.put(BASE_URL + `/${bug._id}`, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}

function getUserBugs(userId) {
    return axios.get('/api/user/bugs/' + userId)
        .then(res => res.data)
}


function getDefaultFilter() {
    return { txt: '', minSeverity: '', pageIdx: 0, paginationOn: true, pageSize: 3, labels: [] }
}

function downloadPDF(bugs) {
    return axios.post('/api/bug/pdf', bugs, { responseType: 'blob' })
        .then(res => {
            const url = window.URL.createObjectURL(res.data)
            const a = document.createElement('a')
            a.href = url
            a.download = 'bugs.pdf'
            a.click()
        })
}

function getLabels() {
    return [
        'back', 'front', 'critical', 'fixed', 'in progress', 'stuck'
    ]
}
