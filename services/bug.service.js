import fs from "fs"
import { utilService } from "./util.service.js"

const bugs = utilService.readJsonFile("data/bug.json")

export const bugService = {
  query,
  getById,
  remove,
  save,
}

function query(filterBy = {}) {
  const {
    txt = "",
    minSeverity = 0,
    labels = [],
    sortBy = "title",
    sortDir = 1,
    pageIdx = 0,
  } = filterBy

  const normalizedLabels = Array.isArray(labels)
    ? labels.map((label) => label.toLowerCase())
    : [labels.toLowerCase()]

  let filteredBugs = bugs
  if (txt) {
    const regex = new RegExp(txt, "i")
    filteredBugs = filteredBugs.filter((bug) => regex.test(bug.title))
  }
  if (minSeverity) {
    filteredBugs = filteredBugs.filter((bug) => bug.severity >= +minSeverity)
  }
  if (normalizedLabels.length) {
    filteredBugs = filteredBugs.filter((bug) =>
      bug.labels?.some((label) =>
        normalizedLabels.includes(label.toLowerCase())
      )
    )
  }
  filteredBugs.sort((a, b) => {
    const valA = a[sortBy]
    const valB = b[sortBy]

    if (typeof valA === "string") {
      return valA.localeCompare(valB) * sortDir
    } else {
      return (valA - valB) * sortDir
    }
  })

  // const pageSize = 3
  // const startIdx = pageIdx * pageSize
  // const bugsPage = filteredBugs.slice(startIdx, startIdx + pageSize)

  // return Promise.resolve(bugsPage)
  return Promise.resolve(filteredBugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject("Cannot find bug - " + bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
  if (bugIdx === -1) return Promise.reject("Cannot remove bug - " + bugId)
  bugs.splice(bugIdx, 1)
  return _saveBugsToFile()
}

function save(bugToSave) {
  if (bugToSave._id) {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id)
    bugs[bugIdx] = bugToSave
  } else {
    bugToSave._id = utilService.makeId()
    bugToSave.createdAt = Date.now()
    bugToSave.description = utilService.makeLorem()
    bugs.push(bugToSave)
  }
  return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile("data/bug.json", data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
