import Cryptr from 'cryptr'
import { userService } from './user.service.js'
const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

export const authService = {
    checkLogin,
    getLoginToken,
    validateToken,
}

function checkLogin({ username, password }) {

    return userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) {
                user = { ...user }
                delete user.password
                return Promise.resolve(user)
            }
            return Promise.reject()
        })
}

function getLoginToken(user) {
    const userInfo = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    let str = JSON.stringify(userInfo)
    console.log('encryptedStr')
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    if (!token) return null

    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}