import { Modal, Form, Button } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import { PostContext } from "../../contexts/PostContext"

const UpdatePostModal = () => {
    // Context
    const {
        postState: {post},
        showUpdatePostModal, 
        setShowUpdatePostModal, 
        updatePost, 
        setShowToast
    } = useContext(PostContext)

    //  State
    const [updatedPost, setUpdatedPost] = useState(post)

    // Cập nhật lại post mỗi khi chọn một post mới
    // Nếu không dùng useEffect thì useState vẫn chưa cập nhật post mới
    // vẫn giữ nguyên post cũ để hiển thij (chi tiết lỗi ở phút 5:37:40)
    useEffect(() => setUpdatedPost(post), [post])

    const {title, description, url, status} = updatedPost

    const onChangeUpdatedPost = event => 
        setUpdatedPost({...updatedPost, [event.target.name] : event.target.value})
    
    const closeDialog = () => {
        setUpdatedPost(post)
        setShowUpdatePostModal(false)
    }

    const onSubmit = async event => {
        event.preventDefault()
        const {success, message}  = await updatePost(updatedPost)
        setShowUpdatePostModal(false)
        setShowToast({show: true, message, type: success ? 'success' : 'danger'})
        
    }

    // const resetAddPostData = () => {
    //     setNewPost({...newPost, title: '', description: '', url: '', status: 'TO LEARN'})
    //     setShowUpdatePostModal(false)
    // }

    return (
        <Modal show={showUpdatePostModal} animation={false} onHide={closeDialog}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Making process?
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control
                            type = 'text'
                            name="title"
                            required
                            aria-describedby="title-help"
                            value={title}
                            onChange={onChangeUpdatedPost}
                        />
                        <Form.Text id='title-help' muted>
							Required
						</Form.Text>
                    </Form.Group> <br></br>
                    <Form.Group>
                        <Form.Control
                            as='textarea'
							rows={3}
							name='description'
                            value={description}
                            onChange={onChangeUpdatedPost}
                        />
                    </Form.Group><br></br>
                    <Form.Group>
                        <Form.Control
                            type='text'
							name='url'
                            value={url}
                            onChange={onChangeUpdatedPost}
                        />
                    </Form.Group><br></br>
                    <Form.Group>
                        <Form.Control
                            as='select'
							name='status'
                            value={status}
                            onChange={onChangeUpdatedPost}
                        >
                            <option value='TO LEARN'>TO LEARN</option>
                            <option value='LEARNING'>LEARNING</option>
                            <option value='LEARNED'>LEARNED</option>
                        </Form.Control>
                    </Form.Group><br></br>
                </Modal.Body>
                <Modal.Footer>
					<Button variant='secondary' onClick={closeDialog}>
						Cancel
					</Button>
					<Button variant='primary' type='submit'>
						LearnIt!
					</Button>
				</Modal.Footer>
            </Form>

        </Modal>
    )
}

export default UpdatePostModal