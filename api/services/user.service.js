
const { User, Sponsorship, Task, Op } = require('./database.service')

module.exports = class UserService {
    searchUsersByUsername = async (username) => {
        return User.findAll({
            where: {
                username: {
                    [Op.like]: `%${username}%`
                }
            },
            limit: 20,
        })
    }
}