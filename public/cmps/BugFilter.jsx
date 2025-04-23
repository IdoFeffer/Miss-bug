const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case "number":
      case "range":
        value = +value || ""
        break

      case "checkbox":
        value = target.checked
        break

      default:
        break
    }

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilterBy(filterByToEdit)
  }

  const { txt, minSeverity, sortBy, sortDir } = filterByToEdit
  return (
    <section className="bug-filter">
      <h2>Filter</h2>
      <form onSubmit={onSubmitFilter}>
        <label htmlFor="txt">Text: </label>
        <input
          value={txt}
          onChange={handleChange}
          type="text"
          placeholder="By Text"
          id="txt"
          name="txt"
        />

        <label htmlFor="minSeverity">Min Severity: </label>
        <input
          value={minSeverity}
          onChange={handleChange}
          type="number"
          placeholder="By Min Severity"
          id="minSeverity"
          name="minSeverity"
        />

        <select
          id="sortBy"
          name="sortBy"
          value={sortBy}
          onChange={handleChange}
        >
          <option value="title">title</option>
          <option value="severity">severity</option>
          <option value="createdAt">created At</option>
        </select>

        <select name="sortDir" value={sortDir} onChange={handleChange}>
          <option value="1">Ascending</option>
          <option value="-1">Descending</option>
        </select>
      </form>
    </section>
  )
}
