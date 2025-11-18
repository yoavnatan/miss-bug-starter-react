const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { authService } from "../services/auth.service.js";


function isAuthorized(bug) {
    const user = authService.getLoggedinUser()
    if (!user) return false
    return user.isAdmin || user._id === bug.creator._id
}

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                    {isAuthorized(bug) &&
                        <React.Fragment>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        </React.Fragment>
                    }
                </section>
            </li>
        ))}
    </ul >
}
