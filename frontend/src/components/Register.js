import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Register = ({ onRegister }) => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = (e) => {
      
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        onRegister(userData);
    }

    return (
        <div className='auth-form'>
            <form className='auth-form__form' onSubmit={handleSubmit}>
                <div className='auth-form__wrapper'>
                    <h3 className='auth-form__title'>Sign up</h3>
                    <label className='auth-form__input'>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            className='auth-form__textfield'
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email || ''}
                            required
                        />
                    </label>
                    <label className='auth-form__input'>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            className='auth-form__textfield'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password || ''}
                            required
                        />
                    </label>
                </div>
                    <button className='auth-form__button' type='submit'>
                        Sign up
                    </button>
                    <p className='auth-form__text'>
                        Already a memeber? {' '}
                        <Link className='auth-form__link' to='/signin'>
                            Log in here!
                        </Link>
                    </p>
            </form>
        </div>
    );
}

export default withRouter(Register);