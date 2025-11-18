const { Link } = ReactRouterDOM

import { UserPreview } from './UserPreview.jsx'
import { authService } from "../services/auth.service.js";


export function UserList({ users, onRemoveUser }) {
    console.log(users)
    if (!users) return <div>Loading...</div>
    return <ul className="user-list">
        {users.map(user => (
            <li key={user._id}>
                <UserPreview user={user} />
                <section className="actions">
                    <button><Link to={`/user/${user._id}`}>Details</Link></button>
                    {/* {isAuthorized(user) && */}
                    <React.Fragment>
                        <button onClick={() => onRemoveUser(user._id)}>x</button>
                    </React.Fragment>
                    {/* } */}
                </section>
            </li>
        ))}
    </ul >
}
