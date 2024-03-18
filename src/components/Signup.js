import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {

    const [credentials, setCredentials] = useState({ name: '', email: '', password: '', cpassword: '' })
    let history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password === credentials.cpassword) {
            const response = await fetch(`http://127.0.0.1:5000/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
            });
            const json = await response.json()

            if (json.success) {
                localStorage.setItem('token', json.authToken)
                history("/")
                props.showAlert("Created account successfully", "success")
            }
            else {
                props.showAlert(json.error, "danger")
            }
        }
        else {
            props.showAlert("Password and Confirm password not matches", "danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'>
            <h2 className='my-5'>Signup to create a account</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Enter name</label>
                    <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" required minLength={5} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" required onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" minLength={5} required id="password" name="password" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" minLength={5} required name="cpassword" onChange={onChange} />
                </div>
                <div style={{ textAlign: "center" }}>
                    <button type="submit" className="btn btn-primary" >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Signup