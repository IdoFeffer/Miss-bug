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
  _setNextPrevBugId,
}

function query(filterBy = {}) {
  return axios.get('/api/bug', { params: filterBy }).then(res => res.data)
}

function getById(bugId) {
  return axios.get(url + bugId)
    .then((res) => res.data)
    .then((bug) => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return axios.delete(url + bugId).then((res) => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(url + bug._id, bug).then(res => res.data)
  } else {
    return axios.post(url, bug).then(res => res.data)
  }
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

function _setNextPrevBugId(bugId) {
  return axios.get(url).then((res) => {
    const bugs = res.data
    const idx = bugs.findIndex((bug) => String(bug._id) === String(bugId))

    if (idx === -1) {
      return null
    }

    const nextBug = bugs[idx + 1] || bugs[0]
    const prevBug = bugs[idx - 1] || bugs[bugs.length - 1]

    return {
      ...bugs[idx],
      nextBugId: nextBug._id,
      prevBugId: prevBug._id,
    }
  })
}
