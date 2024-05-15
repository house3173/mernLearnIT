import {PostContext} from '../contexts/PostContext'
import { useContext, useEffect } from 'react';
import {Spinner, Card, Button, Row, Col, Toast, OverlayTrigger, Tooltip} from 'react-bootstrap'
import SinglePost from '../components/posts/SinglePost';
import {AuthContext} from '../contexts/AuthContext'
import AddPostModal from '../components/posts/AddPostModal';
import UpdatePostModal from '../components/posts/UpdatePostModal';
import addIcon from '../assets/plus-circle-fill.svg'
const DashBoard= () => {
    // Contexts
    const {
        postState: {post, posts, postsLoading},
        getPosts,
        setShowAddPostModal,
        showToast: {show, message, type},
        setShowToast
    } = useContext(PostContext)

    const {authState: {user: {username}}} = useContext(AuthContext)


    // Start: Get all posts
    useEffect(() => {getPosts()}, [])

    let body = null

    if(postsLoading) {
        body = (
			<div className='d-flex justify-content-center mt-2'>
				<Spinner animation='border' variant='info' />
			</div>
		)
    } else {
        if(posts.length === 0) {
            body = (
                <>
                    <Card style={{textAlign: 'center'}}>
                        <Card.Header>Hi {username}</Card.Header>
                        <Card.Body>
                            <Card.Title>Welcome to LearnIT!</Card.Title>
                            <Card.Text>
                            Click the button below to track ypur first skill to learn
                            </Card.Text>
                            <Button variant="primary" onClick={setShowAddPostModal.bind(this,true)}>Learn now</Button>
                        </Card.Body>
                    </Card>
                </>
            )
        } else {
            body = (
                <>
                    <Row className='row-cols-1 row-cols-md-3 g-4 mx-auto mt-3'>
                        {posts.map(post => (
                            <Col key={post._id} className='my-2'>
                                <SinglePost post={post} />
                            </Col>
                        ))}
				    </Row>

                    {/* Open add post modal */}
                    <OverlayTrigger 
                        placement='left'
                        overlay={<Tooltip>Add a new thing to learn</Tooltip>}
                    >
                        <Button className='btn-floating' onClick={setShowAddPostModal.bind(this,true)}>
                            <img src={addIcon} alt='add-post' width='60' height='60'/>
                        </Button>

                    </OverlayTrigger>
                </>
            )
        }
    }

    return (
        <div>
            <h1 style={{textAlign: 'center', margin: '10px 0'}}>DashBoard</h1>
            {body}
            <AddPostModal/>
            {post !== null && <UpdatePostModal />}

            <Toast 
                show={show} 
                style={{ position: 'fixed', top: '20%', right: '10px'}}
                className={`bg-${type} text-white`}
                onClose={setShowToast.bind(this, {
                    show: false,
                    message: '',
                    type: null
                })}
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">Add post message</strong>
                    <small>Now</small>
                </Toast.Header>
                <Toast.Body>
                    <strong>{message}</strong>
                </Toast.Body>
            </Toast>
        </div>
    )
}

export default DashBoard