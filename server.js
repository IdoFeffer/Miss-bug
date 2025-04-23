import express from "express"
import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"
import cookieParser from "cookie-parser"
import path from "path"

const app = express()

//* Express Config:
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())
app.set("query parser", "extended")

//* Express Routing:
//* Read
app.get("/api/bug", (req, res) => {
  // const { txt = "", minSeverity = 0 } = req.query
  const filterBy = {
    txt: req.query.txt || "",
    minSeverity: +req.query.minSeverity || 0,
    labels: req.query.labels ? [].concat(req.query.labels) : [],
    sortBy: req.query.sortBy || "title",
    sortDir: +req.query.sortDir || 1,
    pageIdx: +req.query.pageIdx || 0,
  }

  bugService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error("Cannot get bugs", err)
      res.status(400).send("Cannot load bugs")
    })
})

//* Get/Read by id
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  console.log('Got bugId from URL:', bugId)
  let bugIds = []
  try {
      bugIds = JSON.parse(req.cookies.bugIds || '[]')
  } catch (err) {
      bugIds = []
  }
  console.log(bugIds)
  if (!bugIds.includes(bugId)) {
      bugIds.push(bugId)
  }

  if (bugIds.length > 3) {
      console.log('error')
      return res.status(401).send('Wait for a bit')
  }

  res.cookie('bugIds', JSON.stringify(bugIds), { maxAge: 7 * 1000 })

  bugService.getById(bugId)
      .then(bug => {
          res.send(bug)
      })
      .catch(err => {
          loggerService.error('Cannot get bug', err)
          res.status(400).send('Cannot get bug')
      })
})

//* Remove/Delete
app.delete("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params
  bugService
    .remove(bugId)
    .then(() => res.send(`Bug removed - ${bugId}`))
    .catch((err) => {
      loggerService.error("Cannot remove bug", err)
      res.status(400).send("Cannot remove bug")
    })
})

//* Create
app.post("/api/bug", (req, res) => {
  console.log("req.body:", req.body)
  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: req.body.severity,
    createdAt: req.body.createdAt,
    labels: req.body.labels,
  }
  bugService
    .save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error("Cannot save bug", err)
      res.status(400).send("Cannot save bug")
    })
})

//* Edit
app.put("/api/bug/:bugId", (req, res) => {
  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: req.body.severity,
    createdAt: req.body.createdAt,
    labels: req.body.labels,
  }
  bugService
    .save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error("Cannot save bug", err)
      res.status(400).send("Cannot save bug")
    })
})

//* Fallback route
app.get("/*all", (req, res) => {
  res.sendFile(path.resolve("public/index.html"))
})

const port = 3030

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
