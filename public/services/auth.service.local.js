import { userService } from './user.service.js'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser
}

const LOGGEDIN_USER_KEY = 'loggedInUser'

function login({ username, password }) {
    return userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) return _setLoggedinUser(user)
            return Promise.reject('Invalid login')
        })
}

function signup(user) {
    return userService.add(user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(LOGGEDIN_USER_KEY)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(LOGGEDIN_USER_KEY))
}

function _setLoggedinUser(user) {
    
    const userToSave = { 
        _id: user._id, 
        fullname: user.fullname, 
        isAdmin: user.isAdmin 
    }
    
    sessionStorage.setItem(LOGGEDIN_USER_KEY, JSON.stringify(userToSave))
    return userToSave
}
