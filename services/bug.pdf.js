import fs from "fs"
import PDFDocument from "pdfkit-table"
import { bugService } from "./bug.service.js"

export function generateBugsPdf(bugs, filename = "all-bugs.pdf") {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const stream = fs.createWriteStream(filename)

    stream.on("finish", resolve)
    stream.on("error", reject)

    doc.pip(stream)
    doc.fontSize("20px")
    bugs.forEach((bug, idx) => {
      doc.text(`Title: ${bug.title}`, { paragraphGap: 15 })
      doc.text(`severity: ${bug.severity}`, { paragraphGap: 15 })
      doc.text(`Description: ${bug.Description}`, { paragraphGap: 15 })
      doc.text(`BugId: ${bug._id}`, { paragraphGap: 15 })
      if (idx < bugs.length - 1) doc.page()
    })
    doc.end()
  })
}
