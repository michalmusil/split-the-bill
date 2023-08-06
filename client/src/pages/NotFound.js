import cs from "./NotFound.module.css"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()
    
    const goToHomepage = () => {
        navigate('/')
    }

    return (
        <section className={cs.notFoundSection}>
            <h1>The page you are looking for doesn't exist</h1>
            <button onClick={(e) => { goToHomepage() }}>
                Go back to home page
            </button>
        </section>
    )
}

export default NotFound