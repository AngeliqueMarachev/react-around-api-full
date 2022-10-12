import React from "react";
import { Link, withRouter } from "react-router-dom";

const Login = ({ onRegister }) => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {

    e.preventDefault();
    const userData = {
      email,
      password,
    };
    onRegister(userData);
  };

  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <h3 className="auth-form__title">Sign in</h3>
        <label className="auth-form__input">
          <input
            type="text"
            name="email"
            id="email"
            className="auth-form__textfield"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)} 
            value={email || ''}
            required
          />
        </label>
        <label className="auth-form__input">
          <input
            type="password"
            name="password"
            id="password"
            className="auth-form__textfield"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} 
            value={password || ''}
            required
          />
        </label>
        <button className="auth-form__button" type="submit">
          Sign in
        </button>
        <p className="auth-form__text">
          Not a member yet?{" "}
          <Link className="auth-form__link" to="/signup">
            Sign up here!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default withRouter(Login);
