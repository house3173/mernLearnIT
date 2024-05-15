// Thư viện để nói chuyện vơis backend
import axios from 'axios'

const setAuthToken = token => {
	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	} else {
		delete axios.defaults.headers.common['Authorization']
	}
}

export default setAuthToken

/**
 * đoạn mã axios.defaults.headers.common['Authorization'] là cách để truy cập và thiết lập giá trị của header "Authorization" trong Axios. 
 * Bằng cách gán một chuỗi kết hợp với token vào giá trị của header này, câu lệnh sẽ đảm bảo rằng mỗi yêu cầu HTTP được gửi 
 * từ ứng dụng của bạn sẽ đi kèm với header "Authorization" chứa token cần thiết cho việc xác thực.
 * 
 * Khi máy chủ nhận được yêu cầu, nó có thể sử dụng giá trị token trong header "Authorization" để xác định danh tính của người dùng 
 * và thực hiện các hành động tương ứng, chẳng hạn như cung cấp quyền truy cập cho nguồn tài nguyên được yêu cầu.
 */