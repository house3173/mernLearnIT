import { createContext, useEffect, useReducer } from "react";
import { authReducer } from "../reducers/authReducer";
import {apiUrl, LOCAL_STORAGE_TOKEN_NAME} from './constants'
import setAuthToken from '../utils/setAuthToken' 
import axios from 'axios'

export const AuthContext = createContext()

const AuthContextProvider = ({children}) => {

    // Use to save state authenticate
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null
    })

    // Authenticate user
	const loadUser = async () => {
        /**
         * nếu như đã đăng nhập, tức tồn tại accessToken trong localStorage 
         * thì gọi hàm setAuthToken thực hiện chuyển phần header: Authorization trong yêu cầu HTTP có đinh dạng Bearer
         * axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
         * để chuyển tới cho backend thực hiện phần xác thực
         * */ 
		if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
			setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
		}

		try {
            /** Dùng thư viện Axios để gửi một yêu cầu HTTP GET đến địa chỉ (ở localhost là http://localhost:3000/api/auth) 
             *  Phía server sẽ xử lý yêu cầu này và trả về một response
             *  Sử dụng await vì cần phải đợi phía server xử lý xong, nhận phản hồi rồi mới tiếp tục
             *  Đây là lý do vì sao hàm loadUser phải gán với "async"
             */

            /**
             * Cách thức thực hiện bên phía server
             * 1. Thực hiện middleware verifyToken để xác thực người dùng và trả về res có res.userId (xem mô tả chi tiết ở file server//middleware/auth.js)
             * 2. Sau khi xác thực thành công, sử dụng userId nhận được từ middleware để lấy thông tin người dùng sử dụng findById gồm _id, username, createdAt
             * 3. Trả về kết quả response có dạng { success: true, user } nếu thành công
             */
			const response = await axios.get(`${apiUrl}/auth`)

            // Thành công thực hiện cập nhật trạng thái xác thực cho payload 
            // Trạng thái mới authLoading = false (tức là đã load xong)
            // isAuthenticated: true (đã xác thực thành công), user: response.data.user (trả về user với _id, username, createdAt)
			if (response.data.success) {
				dispatch({
					type: 'SET_AUTH',
					payload: { isAuthenticated: true, user: response.data.user }
				})
			}
		} catch (error) {
			localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
			setAuthToken(null)
			dispatch({
				type: 'SET_AUTH',
				payload: { isAuthenticated: false, user: null }
			})
		}
	}

    // Tác dụng của useEffect này là để luôn loadUser() 1 lần 
    // và load ngay khi phần mềm chạy vì AuthContextProvider bao mọi thành phân trong file App.js
    useEffect(() => {loadUser()}, [])

    // Login
    // Hàm loginUser nhận vào tham số là userForm (truyền từ file LoginForm)
    // Hàm này được gọi khi thực hiện submit form trong LoginForm.js
    const loginUser = async (userForm) => {
        try {
            /** Dùng thư viện Axios gửi một request HTTP POST đến dịa chỉ (ở localhost là http://localhost:3000/api/auth/login) 
             *  kèm theo parameter là userForm (có username và password) --> đợi phản hồi res từ server.
             * 
             * Phía server trả lời (được thực hiện trong file server/routes/auth.js > router.post('/login')) có kết quả:
             * --> Nếu login thất bại, các phản hồi có dạng {success: false, message: ....}
             * --> Nếu login thành công, phản hồi trả về {success: true, message: 'Loggin sucessfully', accessToken}
             *      trong đó accessToken được thư viện ký (sign) trên userId cùng với khóa bí mật process.env.ACCESS_TOKEN_SECRET (file server/env)
             *      khi giải mã accessToken này sử dụng hàm jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) 
             *      sẽ nhận được toàn bộ thông tin của user tương ứng
            */

            // câu trúc của response này: {success: true, message: 'Loggin sucessfully', (Yes or No) accessToken}
            const response = await axios.post(`${apiUrl}/auth/login`, userForm)

            // nếu login thành công, ta sẽ lưu accessToken vào localStorage
            if (response.data.success) {
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
            }

            // Thực hiện hàm loadUser() để gán lại trạng thái xác thực mới cho tài khoản
            await loadUser()

            // trả về toàn bộ phản hồi của server
            return response.data

        } catch (error) {
            // Lỗi do server gửi (LTV thực hiện)
            if (error.response.data) return error.response.data
            // Lỗi khác do hệ thống gửi
			else return { success: false, message: error.message }
        }
    }

    // Register
    // Hàm registerUser nhận vào tham số là userForm (truyền từ file RegisterForm)
    // Hàm này được gọi khi thực hiện submit form trong RegisterForm.js
    const registerUser = async (userForm) => {
        try {
            /** Dùng thư viện Axios gửi một request HTTP POST đến dịa chỉ (ở localhost là http://localhost:3000/api/auth/register) 
             *  kèm theo parameter là userForm (có username và password) --> đợi phản hồi res từ server.
             * 
             * Phía server trả lời (được thực hiện trong file server/routes/auth.js > router.post('/register')) có kết quả:
             * --> Nếu register thất bại, các phản hồi có dạng {success: false, message: ....}
             * --> Nếu register thành công, phản hồi trả về {success: true, message: 'User created sucessfully', accessToken}
             *      trong đó accessToken được thư viện ký (sign) trên userId cùng với khóa bí mật process.env.ACCESS_TOKEN_SECRET (file server/env)
             *      khi giải mã accessToken này sử dụng hàm jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) 
             *      sẽ nhận được toàn bộ thông tin của user tương ứng
            */

            // câu trúc của response này: {success: true, message: 'User created sucessfully', (Yes or No) accessToken}
            const response = await axios.post(`${apiUrl}/auth/register`, userForm)

            // nếu register thành công, ta sẽ lưu accessToken vào localStorage
            // if (response.data.success) {
            //     localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
            // }

            // Thực hiện hàm loadUser() để gán lại trạng thái xác thực mới cho tài khoản
            // await loadUser()

            // trả về toàn bộ phản hồi của server
            return response.data

        } catch (error) {
            // Lỗi do server gửi (LTV thực hiện)
            if (error.response.data) return error.response.data
            // Lỗi khác do hệ thống gửi
			else return { success: false, message: error.message }
        }
    }

    // CheckUser
    // Hàm checkUser nhận vào tham số là username (truyền từ file RegisterForm)
    // Hàm này được gọi khi thực hiện kiem tra xem username dax ton tai hay chua
    const checkUser = async (username) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/checkUser`, username)
            return response.data
        } catch (error) {
            if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
        }
    }

    // Logout
    // Hàm logoutUser sử dụng để đăng xuất phiên làm việc của User hiện tại
    const logoutUser = () => {
        // Xóa token của User trong localStorage
		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
        // Cập nhật trạng thái của User 
		dispatch({
			type: 'SET_AUTH',
			payload: { isAuthenticated: false, user: null }
		})
	}

    
	// Context data
	const authContextData = { loginUser, registerUser, checkUser, logoutUser, authState }

	// Return provider
    // const AuthContext = createContext() chứa các hàm, 
    // thành phần trong authContextData để có thể sử dụng ở các children nằm trong AuthContextProvider
	return (
		<AuthContext.Provider value={authContextData}>
			{children}
		</AuthContext.Provider>
	)

}

export default AuthContextProvider