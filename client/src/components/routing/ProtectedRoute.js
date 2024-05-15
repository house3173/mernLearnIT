import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import NavbarMenu from '../layout/NavbarMenu'

const ProtectedRoute = ({children}) => {
    // Lấy authState được truyền trong useContext(AuthContext và phân rã (destructing) để nhận về authLoading và isAuthenticated)
	const {
		authState: { authLoading, isAuthenticated }
	} = useContext(AuthContext)

    // Nếu việc xác thực đang diễn ra (authLoading = true) thì return Spinner
	if (authLoading)
		return (
			<div className='spinner-container'>
				<Spinner animation='border' variant='info' />
			</div>
		)

    // Nếu việc xác thực xong, đi kiểm tra kết quả xác thực --> xác thực thành công thì trả về các children trong ProtectedRoute
    //                                                      --> xác thực thất bại tức chưa login thì chuyển luôn về trang login
	return isAuthenticated ? (
		<>
			<NavbarMenu/>
			{children}
		</>
	) : (
		<Navigate to='/login' />
	);
}

export default ProtectedRoute