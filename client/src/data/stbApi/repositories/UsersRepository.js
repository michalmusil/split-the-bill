import axios from 'axios'
import routes from '../routes'


// Fetches all users matching the search query
// If seach query is not specified, fetches all available users
const getUsers = async (token, searchQuery) => {
    return (await axios.get(routes.getUsers(searchQuery), {
        headers: { Authorization: token }
    })).data
}

// Fetches a user by the specified id
// If ID is not specified, error is thrown
const getUserById = async (token, id) => {
    if(!id){
        throw Error("Id of the user to fetch wasn't specified")
    }

    return (await axios.get(routes.getUserById(id), {
        headers: { Authorization: token }
    })).data
}

export default {
    getUsers,
    getUserById
}