import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { userLogin } from "../../slices/UserSlice";
import { FiUser, FiMoreHorizontal } from "react-icons/fi";

import "./Login.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { errMsg } = useSelector((state) => state.user);
  const { isAuthSuccess } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFormSubmit = (userCredObj) => {
    dispatch(userLogin(userCredObj));
  };

  useEffect(() => {
    if (localStorage.getItem("isAuth")) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (isAuthSuccess) {
      navigate("/");
    }
  });

  return (
    <Container fluid>
      <h3 className="text-center m-4">Login</h3>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="login-form-width bg-light mx-auto border border-dark rounded p-3"
      >
        {errMsg === "no-user" && (
          <h5
            className="alert alert-danger text-danger text-center"
            role="alert"
          >
            No such username exists
          </h5>
        )}

        {errMsg === "incorrect-password" && (
          <h5
            className="alert alert-danger text-danger text-center"
            role="alert"
          >
            Incorrect Password
          </h5>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            <div className="d-flex align-items-center gap-2">
              <div>
                <FiUser />
              </div>
              <div>Username</div>
            </div>
          </label>

          <input
            type="text"
            id="username"
            className="form-control"
            {...register("username", { required: true })}
          />
          {errors.username?.type === "required" && (
            <p className="text-danger">*Enter your username</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            <div className="d-flex align-items-center gap-2">
              <div>
                <FiMoreHorizontal />
              </div>
              <div>Password</div>
            </div>
          </label>

          <input
            type="password"
            id="password"
            className="form-control"
            {...register("password", { required: true })}
          />
          {errors.password?.type === "required" && (
            <p className="text-danger">*Enter your password</p>
          )}
        </div>

        <button className="d-block mx-auto btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </Container>
  );
};

export default Login;
