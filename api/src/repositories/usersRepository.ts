import User from "models/dbEntities/user.js"
import { databasePool } from "../database/database.js"
import GetUserDto from "models/dtos/getUserDto.js"
import { OkPacket } from "mysql2"

const whereClauseBase = "WHERE 1=1" // The where clause base needs to be valid in case no other clauses are added, thus begins with 1=1

export default class UsersRepository {
    /**
     * Method gets all users from DB with matching optional filters
     * @param searchString only search users whose username or email contains this string
     * @param shoppingId only search for users who either own or are participants in the given shopping
     * @param excludedUserId id of an user to exclude - typically currently logged in user
     * @returns A list of users from DB
     */
    async getUsers(searchString: string | null, shoppingId: number | null, excludedUserId: number | null): Promise<GetUserDto[]> {
        let whereClause = whereClauseBase
        const values: string[] = []
    
        if (searchString != null) {
            whereClause += ` AND (Users.username LIKE ? OR Users.email LIKE ?)`
            values.push(`%${searchString}%`, `%${searchString}%`)
        }
        if (shoppingId != null) {
            whereClause += ` AND Shoppings.id = ?`
            values.push(shoppingId.toString())
        }
        if (excludedUserId != null) {
            whereClause += ` AND Users.id != ?`
            values.push(excludedUserId.toString())
        }
    
        whereClause += ` AND Users.isDeleted = ?`
        values.push("false")
    
    
    
        const [foundUsers] = await databasePool.query(`
            SELECT Users.id, Users.username, Users.email
            FROM Users 
            LEFT JOIN Users_shoppings ON Users.id = Users_shoppings.userId
            LEFT JOIN Shoppings ON Users_shoppings.shoppingId = Shoppings.id OR Users.id = Shoppings.creatorId
            ${whereClause}
            GROUP BY Users.id
        `, values)
    
        return foundUsers as GetUserDto[]
    }
    
    
    /**
     * Retrieves a user from DB based on his unique id
     * @param id id of the user to find
     * @returns User with the given id if successfull, null otherwise
     */
    async getUserById(id: number): Promise<User | null> {
        const [result] = await databasePool.query(`
        SELECT *
        FROM Users 
        WHERE id = ? AND isDeleted = ?
        `, [id, false])
    
        const foundUsers = result as User[]
    
        if (foundUsers.length < 1) {
            return null
        }
        return foundUsers[0]
    }
    
    /**
     * Retrieves a user from DB based on his unique e-mail address
     * @param email email of the user to find
     * @returns User with the given email if successfull, null otherwise
     */
    async getUserByEmail(email: string): Promise<User | null> {
        const [result] = await databasePool.query(`
        SELECT *
        FROM Users 
        WHERE email = ? AND isDeleted = ?
        ` , [email, false])
    
        const foundUsers = result as User[]
    
        if (foundUsers.length < 1) {
            return null
        }
        return foundUsers[0]
    }

    /**
     * Method asynchronoutly adds user to the database
     * @param username username of the new user
     * @param email email of the new user (must be unique)
     * @param password password of the new user
     * @returns id of the created user if successful, null otherwise
     */
    async addUser(username: string, email: string, password: string): Promise<number | null> {
        if (!username || !email || !password) {
            return null
        }
    
        const now = new Date()
        const [result] = await databasePool.query(
            `INSERT INTO Users(username, email, passwordHash, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?)`,
            [username, email, password, now, now]
        ) as OkPacket[]
        return result.insertId
    }

    /**
     * Method for updating fields of a given user in the DB. Use null for parameters that you don't want to update
     * @param userId id of the user to be updated
     * @param username new username of the user
     * @param email new email of the user
     * @param password new password hash of the user
     * @returns true if update was a success, false otherwise
     */
    async updateUser(userId: number, username: string | null, email: string | null, password: string | null): Promise<boolean> {    
        let setStatements = []
        let setValues = []
    
        if (username) {
            setStatements.push("username = ?")
            setValues.push(username)
        }
        if (email) {
            setStatements.push("email = ?")
            setValues.push(email)
        }
        if (password) {
            setStatements.push("passwordHash = ?")
            setValues.push(password)
        }
    
        if (setStatements.length === 0) {
            return false
        }
    
        const now = new Date()
        setStatements.push("updatedAt = ?")
        setValues.push(now)
    
        const finalSetStatement = setStatements.join(',')
    
        const [result] = await databasePool.query(
            `UPDATE Users SET ${finalSetStatement} WHERE id = ?`,
            [...setValues, userId]
        ) as OkPacket[]
        return result.affectedRows > 0
    }

    /**
     * Delete a given user from the DB
     * @param id id of the user to be deleted
     * @returns true if delete was successful, false otherwise
     */
    async deleteUser(id: number): Promise<boolean> {
        const [result] = await databasePool.query(
            `UPDATE Users SET isDeleted = true WHERE id = ?`,
            [id]
        ) as OkPacket[]
        return result.affectedRows > 0
    }
}








