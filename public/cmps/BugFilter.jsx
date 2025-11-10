const { useState, useEffect } = React


export function BugFilter({ filterBy, onSetFilterBy, bugs }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onGetPage(dir) {
        setFilterByToEdit(prev => {
            if (prev.pageIdx + dir < 0 || prev.pageIdx + dir > Math.ceil(bugs.length / filterBy.pageSize)) return prev

            return { ...prev, pageIdx: prev.pageIdx += dir }
        })
    }

    function togglePagination() {
        setFilterByToEdit(prev => {
            const paginationOn = !prev.paginationOn
            return { ...prev, paginationOn }
        })
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <section className="pagination">

                <button disabled={!filterBy.paginationOn} onClick={() => onGetPage(-1)}>-</button>
                <span>{filterBy.paginationOn && filterBy.pageIdx + 1}</span>
                <button disabled={!filterBy.paginationOn} onClick={() => onGetPage(1)}>+</button>

                <button onClick={togglePagination}>Toggle Pagination</button>
            </section>

            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
            </form>
        </section>
    )
}