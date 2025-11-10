import { utilService } from './util.service.js'
import { showErrorMsg } from './event-bus.service.js'
import { download } from '../../services/util.service.js'

import fs from 'fs'
import PDFDocument from 'pdfkit-table'

const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    downloadPDF
}

function query(filterBy = {}) {
    console.log(filterBy)
    return axios.get(BASE_URL, { params: filterBy })
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

    if (bug.id) {
        return axios.put(BASE_URL + `/${bug.id}`, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}


function getDefaultFilter() {
    return { txt: '', minSeverity: '', pageIdx: 0, paginationOn: true, pageSize: 3 }
}

function downloadPDF() {
    return createPdf()
        .then(res => console.log(res))
}

