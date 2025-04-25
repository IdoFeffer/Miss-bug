const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"

export function BugDetails() {
  const [bug, setBug] = useState(null)
  const { bugId } = useParams()

  useEffect(() => {
    loadBug()
  }, [bugId])

  function loadBug(){
    bugService
    .getById(bugId)
      .then((bug) => setBug(bug))
      .catch((err) => showErrorMsg(`Cannot load bug`, err))
  }

  if (!bug) return <div>Loading bug...</div>
  return (
    <div className="bug-details">
      <h3>Bug Details</h3>
      {bug && (
        <div>
          <h4>{bug.title}</h4>
          <h5>
            Severity: <span>{bug.severity}</span>
          </h5>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam esse
            facilis vitae numquam architecto mollitia fugiat culpa minima
            aperiam amet sapiente, voluptate sit, in nemo ea. Expedita iure
            tempore explicabo?
          </p>
        </div>
      )}
      <hr />
      <Link to="/bug">Back to List</Link>
      <section>
        <Link to={`/bug/${bug.prevBugId}`}>Prev</Link>
        <Link to={`/bug/${bug.nextBugId}`}>Next</Link>
      </section>
    </div>
  )
}
