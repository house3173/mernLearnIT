const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

		req.userId = decoded.userId
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}

module.exports = verifyToken

/** Giải thích cách thức hoạt động:
 * Hàm verifyToken nhận một phản hồi (req)
 * Từ req lấy ra header Authorization có trên req để xác thực người dùng
 * Vì Authorization có dạng Bearer (tức Bearer token) nên sử dụng split theo dấu cách để lấy ra token trong Authorization
 * Nếu không có token thì trả về không có token để xác thực danh tính
 * Nếu có thì thực hiện try - catch
 * 		Trong try, sử dụng thư viện jsonwebtoken(jwt) để xác thực token và ACCESS_TOKEN_SECRET (khóa bí mật) của môi trường (trong file .env)
 * 		hàm này trả về decoded chứa thông tin của đối tượng được ký bằng token này (ở đây là một đối tượng user)
 * 			Ta gán cho phản hồi thuộc tính userId lấy thông qua decoded sau đó gọinext() đồng nghĩa với việc xác thực thành công
 * 		
 * 		Nếu có lỗi thì thực hiện catch
 */