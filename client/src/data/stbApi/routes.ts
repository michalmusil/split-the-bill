const baseUrl = "http://localhost:5050/api/v1"

export default {
    logIn: `${baseUrl}/auth/login`,
    register: `${baseUrl}/auth/register`,

    getAllShoppings: (searchQuery: string | null) => { return `${baseUrl}/shoppings${searchQuery ? `?search=${searchQuery}` : ""}` },
    getShoppingById: (id: number) => { return `${baseUrl}/shoppings/${id}` },
    deleteShopping: (id: number) => { return `${baseUrl}/shoppings/${id}` },
    postNewShopping: `${baseUrl}/shoppings`,
    getUsersOfShoppingByShoppingId: (id: number) => { return `${baseUrl}/users?shoppingId=${id}` },

    getProductAssignmentsByShoppingId: (id: number) => { return `${baseUrl}/shoppings/${id}/productAssignments` },
    addOrUpdateProductAssignment: (shoppingId: number) => { return `${baseUrl}/shoppings/${shoppingId}/addOrUpdateProduct` },

    assignUserToShopping: (userId: number, shoppingId: number) => { return `${baseUrl}/shoppings/${shoppingId}/assignUser?userId=${userId}` },
    unassignUserFromShopping: (userId: number, shoppingId: number) => { return `${baseUrl}/shoppings/${shoppingId}/unassignUser?userId=${userId}` },

    getUserById: (id: number) => { return `${baseUrl}/users/${id}` },
    getUsers: (searchQuery: string | null) => { return `${baseUrl}/users${searchQuery ? `?searchString=${searchQuery}` : ""}` },

    getProductById: (id: number) => { return `${baseUrl}/products/${id}` },

    getPurchasesOfProducts: (shoppingId: number, userId: number | null) => { return `${baseUrl}/purchases/${shoppingId}/getByProducts${userId ? `?userId=${userId}` : ""}` },
    getPurchasesOfUsers: (shoppingId: number, userId: number | null) => { return `${baseUrl}/purchases/${shoppingId}/getByUsers${userId ? `?userId=${userId}` : ""}` },
}

