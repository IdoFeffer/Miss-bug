const { Link } = ReactRouterDOM
const { Fragment } = React
import { authService } from "../services/auth.service.js"

import { BugPreview } from "./BugPreview.jsx"

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  function isAllowed(bug) {
    const user = authService.getLoggedinUser()
    if (!user || !bug.creator) return false
    if (bug.creator._id === user._id || user.isAdmin) {
      return true
    }
    return false
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li key={bug._id}>
          <BugPreview bug={bug} />
          <section className="actions">
            <button>
              <Link to={`/bug/${bug._id}`}>Details</Link>
            </button>
            {isAllowed(bug) && (
              <Fragment>
                <button onClick={() => onEditBug(bug)}>Edit</button>
                <button onClick={() => onRemoveBug(bug._id)}>Remove</button>
              </Fragment>
            )}
          </section>
        </li>
      ))}
    </ul>
  )
}
