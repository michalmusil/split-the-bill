const baseUrl = "http://localhost:5050/api/v1"

const routing = {
    logIn: `${baseUrl}/auth/login`,
    register: `${baseUrl}/auth/register`,
    getAllShoppings: `${baseUrl}/shoppings`,
    getShoppingById: (id) => { return `${baseUrl}/shoppings/${id}` },
    postNewShopping: `${baseUrl}/shoppings`,
    getProductAssignmentsByShoppingId: (id) => { return `${baseUrl}/shoppings/${id}/productAssignments` },
    getUsersOfShoppingByShoppingId: (id) => { return `${baseUrl}/users?shoppingId=${id}` },
    getUserById: (id) => { return `${baseUrl}/users/${id}` },
    getProductById: (id) => { return `${baseUrl}/products/${id}` },
    addOrUpdateProductAssignment: (shoppingId) => { return `${baseUrl}/shoppings/${shoppingId}/addOrUpdateProduct` },
}

const cookies = {
    jwtTokenKey: "user-jwt"
}

export default {
    routing,
    cookies
}