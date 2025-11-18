export function UserPreview({ user }) {
    return <article className="user-preview">
        <p className="title">{user.username}</p>
        <p>Full name: <span>{user.fullname}</span></p>
    </article>
}