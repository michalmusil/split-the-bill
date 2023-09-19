const baseUrl = "http://localhost:5050/api/v1"

export default {
    logIn: `${baseUrl}/auth/login`,
    register: `${baseUrl}/auth/register`,
    
    getAllShoppings: (searchQuery) => { return `${baseUrl}/shoppings${searchQuery ? `?search=${searchQuery}` : ""}`},
    getShoppingById: (id) => { return `${baseUrl}/shoppings/${id}` },
    deleteShopping: (id) => { return `${baseUrl}/shoppings/${id}` },
    postNewShopping: `${baseUrl}/shoppings`,
    getUsersOfShoppingByShoppingId: (id) => { return `${baseUrl}/users?shoppingId=${id}` },

    getProductAssignmentsByShoppingId: (id) => { return `${baseUrl}/shoppings/${id}/productAssignments` },
    addOrUpdateProductAssignment: (shoppingId) => { return `${baseUrl}/shoppings/${shoppingId}/addOrUpdateProduct` },

    assignUserToShopping: (userId, shoppingId) => { return `${baseUrl}/shoppings/${shoppingId}/assignUser?userId=${userId}` },
    unassignUserFromShopping: (userId, shoppingId) => { return `${baseUrl}/shoppings/${shoppingId}/unassignUser?userId=${userId}` },

    getUserById: (id) => { return `${baseUrl}/users/${id}` },
    getUsers: (searchQuery) => { return `${baseUrl}/users${searchQuery ? `?searchString=${searchQuery}` : ""}`},
    
    getProductById: (id) => { return `${baseUrl}/products/${id}` },

    getPurchasesOfProducts: (shoppingId, userId) => { return `${baseUrl}/purchases/${shoppingId}/getByProducts${userId ? `?userId=${userId}` : ""}`},
    getPurchasesOfUsers: (shoppingId, userId) => { return `${baseUrl}/purchases/${shoppingId}/getByUsers${userId ? `?userId=${userId}` : ""}`},
}

