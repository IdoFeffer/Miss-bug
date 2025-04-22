import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const url = "/api/bug/"

// const STORAGE_KEY = 'bugs'
// _createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy) {
    // return storageService.query(STORAGE_KEY)
    // .then(bugs => {

    //     if (filterBy.txt) {
    //         const regExp = new RegExp(filterBy.txt, 'i')
    //         bugs = bugs.filter(bug => regExp.test(bug.title))
    //     }

    //     if (filterBy.minSeverity) {
    //         bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    //     }

    //     return bugs
    // })

    return axios.get(url).then(res => res.data)
}

function getById(bugId) {
    // return storageService.get(STORAGE_KEY, bugId)
    return axios.get(url + bugId).then(res => res.data)
}

function remove(bugId) {
    // return storageService.remove(STORAGE_KEY, bugId)
    return axios.get(url +bugId+'/remove').then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (bugs && bugs.length > 0) return 

    bugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053"
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}