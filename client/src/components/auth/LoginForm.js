import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom'

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LoginForm = () => {
    // Context
	const { loginUser } = useContext(AuthContext)

    //Router
    const navigate = useNavigate()

    // Local state
	const [loginForm, setLoginForm] = useState({
		username: '',
		password: ''
	})

	// const [alert, setAlert] = useState(null)

	const { username, password } = loginForm

	const onChangeLoginForm = event => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
        console.log(loginForm)
    }

    const login = async event => {
		event.preventDefault()

		try {
			const loginData = await loginUser(loginForm)
            console.log(loginData)
            if(loginData.success) {
                navigate('/dashboard')
            }
			// if (!loginData.success) {
			// 	setAlert({ type: 'danger', message: loginData.message })
			// 	setTimeout(() => setAlert(null), 5000)
			// }
		} catch (error) {
			console.log(error)
		}
	}
		
    return (
        <>
            <Form onSubmit={login}>
                <Form.Group className='mt-2'>
                    <Form.Control 
                        type='text' 
                        placeholder='Username' 
                        name='username' 
                        required
                        value={username}
                        onChange={onChangeLoginForm}
                    />
                </Form.Group>
                <Form.Group className='mt-2'>
                    <Form.Control 
                        type='password' 
                        placeholder='Password' 
                        name='password' 
                        required
                        value={password}
                        onChange={onChangeLoginForm}
                    />
                </Form.Group>
                <Button className='mt-2' variant='success' type='submit'>
                    Login
                </Button>
            </Form>
            <p className='mt-2'>
                Don't have an account?  
                <Link to='/register'>
                    <Button variant='info' size='sm' className='ml-4'>
						Register
					</Button>
                </Link>
            </p>

        </>
    )
}

export default LoginForm