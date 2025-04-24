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
  return axios.get("/api/bug", { params: filterBy }).then((res) => res.data)
}

function getById(bugId) {
  return axios
    .get(url + bugId)
    .then((res) => {
      return res.data
    })
    .then((bug)=>_setNextPrevBugId(bug))
}

function remove(bugId) {
  return axios.delete(url + bugId).then((res) => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(url + bug._id, bug).then((res) => res.data)
  } else {
    return axios.post(url, bug).then((res) => res.data)
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

// function getDefaultFilter() {
//   return { txt: "", minSeverity: 0 }
// }

function getDefaultFilter() {
  return {
    txt: "",
    minSeverity: 0,
    sortBy: "title",
    sortDir: 1,
    labels: [],
    pageIdx: 0,
  }
}

function _setNextPrevBugId(bug) {
  return query().then((bugs)=>{
    const bugIdx = bugs.findIndex((currBug)=>currBug._id === bug._id)
    const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0] 
    const prevBug =  bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
    bug.nextBugId = nextBug._id
    bug.prevBugId = prevBug._id
    return bug
  })
}
