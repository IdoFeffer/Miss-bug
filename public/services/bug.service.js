import { utilService } from "./util.service.js"
import { storageService } from "./async-storage.service.js"

const url = "/api/bug/"

// const STORAGE_KEY = 'bugs'
// _createBugs()

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}

function query(filterBy) {
  return axios.get(url).then((res) => res.data)
}

function getById(bugId) {
  return axios.get(url + bugId).then((res) => res.data)
}

function remove(bugId) {
  return axios.get(url + bugId + "/remove").then((res) => res.data)
}

function save(bug) {
  return axios.get(url + "save", { params: bug }).then((res) => res.data)
}

function _createBugs() {
  let bugs = utilService.loadFromStorage(STORAGE_KEY)
  if (bugs && bugs.length > 0) return

  bugs = [
    {
      title: "Infinite Loop Detected",
      severity: 4,
      _id: "1NF1N1T3",
    },
    {
      title: "Keyboard Not Found",
      severity: 3,
      _id: "K3YB0RD",
    },
    {
      title: "404 Coffee Not Found",
      severity: 2,
      _id: "C0FF33",
    },
    {
      title: "Unexpected Response",
      severity: 1,
      _id: "G0053",
    },
  ]
  utilService.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
  return { txt: "", minSeverity: 0 }
}
