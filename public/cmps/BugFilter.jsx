import { bugService } from "../services/bug.service.remote.js"
import { LabelChooser } from "./LabelChooser.jsx"

const { useState, useEffect } = React


export function BugFilter({ filterBy, onSetFilterBy, bugs }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const labels = bugService.getLabels()

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function resetSort() {
        setFilterByToEdit(prev => ({ ...prev, sortField: '', sortDir: 1 }))
    }

    function onResetFilter() {
        setFilterByToEdit(prev => ({ ...prev, txt: '', minSeverity: 0 }))
    }


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

            case 'radio':
                value = target.value
                break

            default:
                break

            // case 'select-multiple':
            //     const options = target.options;
            //     value = [];
            //     for (let i = 0, l = options.length; i < l; i++) {
            //         if (options[i].selected) {
            //             value.push(options[i].value);
            //         }
            //     }
            //     setSelectedVals(value)

            // value = target.options.filter(option => option.selected)
            // break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
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
                <div className="filter-by">
                    <label className="tag" htmlFor="txt">Text: </label>
                    <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                    <label htmlFor="minSeverity">Min Severity: </label>
                    <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                    <button onClick={onResetFilter}>Clear Filter</button>
                </div>

                <div className="sort-by">
                    <div className="sort-field">
                        <label className="tag">
                            <span>Title</span>
                            <input
                                type="radio"
                                name="sortField"
                                value="title"
                                checked={filterByToEdit.sortField === 'title'}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="tag">
                            <span>Severity</span>
                            <input
                                type="radio"
                                name="sortField"
                                value="severity"
                                checked={filterByToEdit.sortField === 'severity'}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="tag">
                            <span>Created At</span>
                            <input
                                type="radio"
                                name="sortField"
                                value="createdAt"
                                checked={filterByToEdit.sortField === 'createdAt'}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="sort-dir">
                        <label className="tag">
                            <span>Asce</span>
                            <input
                                type="radio"
                                name="sortDir"
                                value="1"
                                checked={filterByToEdit.sortDir === '1'}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="tag">
                            <span>Desc</span>
                            <input
                                type="radio"
                                name="sortDir"
                                value="1"
                                checked={filterByToEdit.sortDir === '-1'}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={resetSort}>Clear Sort</button>

                    </div>
                </div>
                <LabelChooser
                    labels={labels}
                    filterBy={filterByToEdit}
                    onSetFilterBy={setFilterByToEdit} />
            </form>
        </section>
    )
}

// function MultiSelect({items}) {

//     const [selectedItems, setSelectedItems] = useState([])

//     return (
//         <div className="multi-select">
//             <div className="head">
// {selectedItems? selectedItems }
//             </div>
//         </div>
//     )
// }