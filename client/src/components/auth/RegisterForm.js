import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom'

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const RegisterForm = () => {

    // Context
	const { registerUser, checkUser } = useContext(AuthContext)

    //Router
    const navigate = useNavigate()

    // Local state
	const [registerForm, setRegisterForm] = useState({
		username: '',
		password: '',
        confirmPassword: ''
	})

    const [errorForm, setErrorForm] = useState({
        errorConfirm: '',
        errorExistUser: ''
    })

	// const [alert, setAlert] = useState(null)

	const { username, password, confirmPassword } = registerForm
    const { errorConfirm, errorExistUser} = errorForm

	const onChangeRegisterForm = async event => {
        setRegisterForm({ ...registerForm, [event.target.name]: event.target.value })

        if(event.target.name === 'username') {
            const checkUserResponse = await checkUser({username: event.target.value})
            if(!checkUserResponse.success) {
                setErrorForm({ ...errorForm, errorExistUser: 'Tài khoản đã tồn tại!'})
            } else {
                setErrorForm({ ...errorForm, errorExistUser: ''})
            }
        }

        if(event.target.name === 'confirmPassword') {
            if(event.target.value !== password) {
                setErrorForm({ ...errorForm, errorConfirm: 'Mật khẩu nhập lại không đúng!'})
            } else {
                setErrorForm({ ...errorForm, errorConfirm: ''})
            }
        }

        if(event.target.name === 'password') {
            if(event.target.value !== confirmPassword) {
                setErrorForm({ ...errorForm, errorConfirm: 'Mật khẩu nhập lại không đúng!'})
            } else {
                setErrorForm({ ...errorForm, errorConfirm: ''})
            }
        }

        console.log(registerForm)
    }

    const register = async event => {
		event.preventDefault()

		try {

            if(errorExistUser || errorConfirm) {
                
                const inputConfirmPassword = document.querySelector('input[name="confirmPassword"]')
                if(inputConfirmPassword && errorConfirm) 
                    inputConfirmPassword.focus()
                
                const inputUsername = document.querySelector('input[name="username"]')
                if(inputUsername && errorExistUser) 
                    inputUsername.focus()
                
                return

            } else {
                const registerFormSendServer = {username: registerForm.username, password: registerForm.password}
                const registerData = await registerUser(registerFormSendServer)
                console.log(registerData)
                if(registerData.success) 
                    navigate('/login')
            }       
            
			// if (!registerData.success) {
			// 	setAlert({ type: 'danger', message: registerData.message })
			// 	setTimeout(() => setAlert(null), 3000)
			// }
		} catch (error) {
			console.log(error)
		}
	}

    return (
        <>
            <Form onSubmit={register}>
                <Form.Group className='mt-2'>
                    <Form.Control 
                        type='text' 
                        placeholder='Username' 
                        name='username' 
                        required
                        value={username}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <p style={{color: 'red', fontSize: '12px', textAlign: 'left', marginBottom: '-1px'}}>{errorExistUser}</p>

                <Form.Group className='mt-2'>
                    <Form.Control 
                        type='password' 
                        placeholder='Password' 
                        name='password' 
                        required
                        value={password}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Form.Group className='mt-2'>
                    <Form.Control 
                        type='password' 
                        placeholder='Confirm password' 
                        name='confirmPassword' 
                        required
                        value={confirmPassword}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <p style={{color: 'red', fontSize: '12px', textAlign: 'left', marginBottom: '-1px'}}>{errorConfirm}</p>
                <Button className='mt-2' variant='success' type='submit'>
                    Register
                </Button>
            </Form>
            <p className='mt-2'>
                Already have account?   
                <Link to='/login'>
                    <Button variant='info' size='sm' className='ml-4'>
						Login
					</Button>
                </Link>
            </p>

        </>
    )
}

export default RegisterForm