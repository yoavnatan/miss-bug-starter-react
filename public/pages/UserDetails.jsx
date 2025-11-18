const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.remote.js"
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails({ loggedinUser }) {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        bugService.getUserBugs(loggedinUser._id)
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

    function onBack() {
        navigate('/')
    }


    if (!user || !userBugs) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <h2>bugs:</h2>
            <BugList bugs={userBugs} />
            <button onClick={onBack} >Back</button>
        </section>
    )
}