const { useState, useEffect, useRef } = React

export function BugSort({ filterBy, onSetFilterBy }) {

    const sortDir = useRef(1)

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function onToggleSortDir() {
        sortDir.current = sortDir.current * -1
        setFilterByToEdit(prevFilter => ({ ...prevFilter, ['sortDir']: sortDir.current }))
    }

    function handleChange({ target }) {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, ['sortBy']: target.value, ['sortDir']: sortDir.current }))
    }

    return (
        <div>
            <label htmlFor="bug-sort">Sort by: </label>
            <select name="bug-sort" id="bug-sort" onChange={handleChange}>
                <option value=""></option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created at</option>
            </select>
            <input type="checkbox" id="sort-dir" name="sort-dir" onChange={onToggleSortDir} />
            <label htmlFor="sort-dir"> descending</label>

        </div>
    )
}