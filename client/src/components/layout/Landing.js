import { Navigate } from 'react-router-dom'
const Landing = () => {
    // const navigate = useNavigate();

    return (
        // navigate('/login')
        <Navigate to="/login" replace/>
    )
}

export default Landing