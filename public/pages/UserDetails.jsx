const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.remote.js"
import { BugList } from '../cmps/BugList.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'


export function UserDetails() {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        bugService.getUserBugs(params.userId)
            .then(setUserBugs)
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('New Description?', bug.description)
        const bugToSave = { ...bug, severity, description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = userBugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onBack() {
        navigate('/bug')
    }


    if (!user || !userBugs) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <h2>bugs:</h2>
            <BugList bugs={userBugs} onEditBug={onEditBug} onRemoveBug={onRemoveBug} />
            <button onClick={onBack} >Back</button>
        </section>
    )
}