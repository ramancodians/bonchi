import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <Helmet>
        <title>Login - Bonchi v3</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <p>Login page content goes here</p>
            <div className="card-actions justify-end">
              <Link to="/register" className="link">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
