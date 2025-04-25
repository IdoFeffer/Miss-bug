import express from "express"
import path from "path"
import cookieParser from "cookie-parser"

import { bugService } from "./services/bug.service.js"
import { userService } from "./services/user.service.js"
import { loggerService } from "./services/logger.service.js"
import { authService } from './services/auth.service.js'

const app = express()

//* Express Config:
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())
app.set("query parser", "extended")

//* Express Routing:
//* Read
app.get("/api/bug", (req, res) => {
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
app.get("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params
  console.log("Got bugId from URL:", bugId)
  let bugIds = []
  try {
    bugIds = JSON.parse(req.cookies.bugIds || "[]")
  } catch (err) {
    bugIds = []
  }
  console.log(bugIds)
  if (!bugIds.includes(bugId)) {
    bugIds.push(bugId)
  }

  if (bugIds.length > 3) {
    console.log("error")
    return res.status(401).send("Wait for a bit")
  }

  res.cookie("bugIds", JSON.stringify(bugIds), { maxAge: 7 * 1000 })

  bugService
    .getById(bugId)
    .then((bug) => {
      res.send(bug)
    })
    .catch((err) => {
      loggerService.error("Cannot get bug", err)
      res.status(400).send("Cannot get bug")
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

// TODO: PDF file
app.get('/api/bug/pdf', (req, res) => {
  bugService.query().then(bugs => {
    buildBugsPDF(bugs, 'all-bugs.pdf')
      .then(filePath => res.download(filePath, 'bugs.pdf'))
      .catch(err => {
        console.error('Failed to generate PDF:', err)
        res.status(500).send('Could not generate PDF')
      })
  }).catch(err => {
    console.error('Cannot get bug', err)
    res.status(400).send('Cannot get bug')
  })
})

//* User API
app.get('/api/user', (req, res) => {
  userService.query()
      .then(users => res.send(users))
      .catch(err => {
          loggerService.error('Cannot load users', err)
          res.status(400).send('Cannot load users')
      })
})

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params

  userService.getById(userId)
      .then(user => res.send(user))
      .catch(err => {
          loggerService.error('Cannot load user', err)
          res.status(400).send('Cannot load user')
      })
})

//* Auth API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  authService.checkLogin({ username, password })
      .then(user => {
          const loginToken = authService.getLoginToken(user)
          res.cookie('loginToken', loginToken)
          res.send(user)
      })
      .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
  const { username, password, fullname } = req.body
  userService.add({ username, password, fullname })
      .then(user => {
          if (user) {
              const loginToken = authService.getLoginToken(user)
              res.cookie('loginToken', loginToken)
              res.send(user)
          } else {
              res.status(400).send('Cannot signup')
          }
      })
      .catch(err => {
          console.log('err:', err)
          res.status(400).send('Username taken.')
      })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged-out!')
})

app.get('/echo-cookies', (req, res) => {
  var cookieCount = 0
  var resStr = ''

  for (const cookie in req.cookies) {
      const cookieStr = `${cookie}: ${req.cookies[cookie]}`
      console.log(cookieStr)

      resStr += cookieStr + '\n'
      cookieCount++
  }
  resStr += `Total ${cookieCount} cookies`
  res.send(resStr)
})

//* Fallback route
app.get("/*all", (req, res) => {
  res.sendFile(path.resolve("public/index.html"))
})

const port = 3030

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
