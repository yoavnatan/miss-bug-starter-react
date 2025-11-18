import { UserList } from "../cmps/UserList.jsx"
import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'


const { useState, useEffect, useRef } = React

export function UserIndex() {
    const [users, setUsers] = useState(null)

    useEffect(loadUsers, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => showErrorMsg(`Couldn't load users - ${err}`))
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const UsersToUpdate = users.filter(user => user._id !== userId)
                setUsers(UsersToUpdate)
                showSuccessMsg('user removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove user`, err))
    }

    return (
        <section className="user-index main-content">
            <UserList users={users} onRemoveUser={onRemoveUser} />
        </section>

    )
}