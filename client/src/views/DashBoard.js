import {PostContext} from '../contexts/PostContext'
import { useContext, useEffect } from 'react';

const DashBoard= () => {
    // Contexts
    const {
        postState: {posts, postsLoading},
        getPosts
    } = useContext(PostContext)


// Start: Get all posts
useEffect(() => getPosts(), [])

    return (
        <div>
            <h1>DashBoard</h1>
        </div>
    )
}

export default DashBoard