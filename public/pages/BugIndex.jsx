const { useState, useEffect } = React

import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
// import {PDFDocument} from "pdfkit-table"

import { BugFilter } from "../cmps/BugFilter.jsx"
import { BugList } from "../cmps/BugList.jsx"

export function BugIndex() {
  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  function loadBugs() {
    bugService
      .query(filterBy)
      .then((res) => {
        setBugs(res)
      })
      .catch((err) => showErrorMsg(`Couldn't load bugs - ${err}`))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg("Bug removed")
      })
      .catch((err) => showErrorMsg(`Cannot remove bug`, err))
  }

  function onAddBug() {
    const bug = {
      title: prompt("Bug title?", "Bug " + Date.now()),
      severity: +prompt("Bug severity?", 3),
    }

    bugService
      .save(bug)
      .then((savedBug) => {
        setBugs([...bugs, savedBug])
        showSuccessMsg("Bug added")
      })
      .catch((err) => showErrorMsg(`Cannot add bug`, err))
  }

  function onEditBug(bug) {
    const severity = +prompt("New severity?", bug.severity)
    if (!severity) return 
    const bugToSave = { ...bug, severity }

    bugService
      .save(bugToSave)
      .then((savedBug) => {
        const bugsToUpdate = bugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
        setBugs(bugsToUpdate)
        showSuccessMsg("Bug updated")
      })
      .catch((err) => showErrorMsg("Cannot update bug", err))
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
  }

  function onNextPage() {
    setFilterBy((prevFilter) => ({
      ...prevFilter,
      pageIdx: prevFilter.pageIdx + 1 
    }))
  }

  function onPrevPage() {
    setFilterBy((prevFilter) => ({
      ...prevFilter,
      pageIdx: Math.max(0, prevFilter.pageIdx - 1),
    }))
  }


  // TODO:
  function onDownloadPDF() {
    fetch('/api/bug/pdf')
      .then(res => {
        if (!res.ok) throw new Error('Failed to download PDF')
        return res.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'bugs.pdf'
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch(err => {
        console.error('Error downloading PDF:', err)
        showErrorMsg('Failed to download PDF')
      })
  }

  return (
    <section className="bug-index main-content">
      <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
      <header>
        <h3>Bug List</h3>
        <button onClick={onAddBug}>Add Bug</button>
      </header>
      <button onClick={onDownloadPDF}>Download pdf</button>
      <section className="nextPrev">
        <button onClick={onPrevPage}>Prev</button>
        <button onClick={onNextPage}>Next</button>
      </section>
      {(!bugs || !bugs.length)
      ? <div>No bugs</div>
      : <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      }
    </section>
  )
}
