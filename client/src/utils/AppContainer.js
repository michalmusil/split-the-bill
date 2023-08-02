const baseUrl = "http://localhost:5050/api/v1"

const routing = {
    logIn: `${baseUrl}/auth/login`,
    register: `${baseUrl}/auth/register`,
    getAllShoppings: `${baseUrl}/shoppings`,
}

const cookies = {
    jwtTokenKey: "user-jwt"
}

export default {
    routing,
    cookies
}