import express from "express"
import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"
import cookieParser from "cookie-parser"
const app = express()

//* Express Config:

app.use(express.static("public"))
app.use(cookieParser())

// app.get("/", (req, res) => res.send("Hello there"))
// app.listen(3030, () => console.log("Server ready at port 3030"))

//* Express Routing:
//* Read
app.get("/api/bug", (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error("Cannot get bugs", err)
      res.status(400).send("Cannot load bugs")
    })
})

//* Create/Edit
app.get("/api/bug/save", (req, res) => {
  const bugToSave = {
    _id: req.query._id,
    title: req.query.title,
    description: req.query.description,
    severity: +req.query.severity,
    createdAt: +req.query.createdAt,
  }
  bugService
    .save(bugToSave)
    .then((savedBugs) => res.send(savedBugs))
    .catch((err) => {
      loggerService.error("Cannot save bug", err)
      res.status(400).send("Cannot save bug")
    })
})

//* Get/Read by id
app.get("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot get bug", err)
      res.status(400).send("Cannot get bug")
    })
})

//* Remove/Delete
app.get("/api/bug/:bugId/remove", (req, res) => {
  const { bugId } = req.params
  bugService
    .remove(bugId)
    .then(() => res.send(`Bug removed - ${bugId}`))
    .catch((err) => {
      loggerService.error("Cannot remove bug", err)
      res.status(400).send("Cannot remove bug")
    })
})

const port = 3030

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
