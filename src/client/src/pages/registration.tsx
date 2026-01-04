import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <>
      <Helmet>
        <title>Register - Bonchi v3</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Register</h2>
            <p>Registration page content goes here</p>
            <div className="card-actions justify-end">
              <Link to="/login" className="link">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
