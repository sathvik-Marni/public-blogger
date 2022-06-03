import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMoreHorizontal, FiAtSign } from "react-icons/fi";

import axios from "axios";

import "./Signin.css";

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [userexists, setUserexists] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = (userDataObj) => {
    axios
      .post("/user/signin", userDataObj)
      .then((response) => {
        if (response.data.message === "user-exists") {
          setUserexists(true);
        } else {
          setUserexists(false);
          navigate("/login");
        }
      })
      .catch((err) => console.log(`Error occured: ${err.message}`));
  };

  useEffect(() => {
    if (localStorage.getItem("isAuth")) {
      navigate("/");
    }
  });

  return (
    <Container fluid>
      <h3 className="text-center m-4">Sign In</h3>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="signin-form-width bg-light mx-auto border border-dark rounded p-3"
      >
        {userexists && (
          <h5
            className="alert alert-danger text-danger text-center"
            role="alert"
          >
            Username already taken
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
            {...register("username", {
              required: true,
              pattern: /^[a-zA-Z0-9]*$/,
            })}
          />
          {errors.username?.type === "required" && (
            <p className="text-danger">*Enter your username</p>
          )}
          {errors.username?.type === "pattern" && (
            <p className="text-danger">
              *Username shouldn't have white spaces
            </p>
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
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password?.type === "required" && (
            <p className="text-danger">*Enter your password</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-danger">
              *Password should be a minimum of 8 characters
            </p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            <div className="d-flex align-items-center gap-2">
              <div>
                <FiAtSign />
              </div>
              <div>Email</div>
            </div>
          </label>

          <input
            type="email"
            id="email"
            className="form-control"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
            })}
          />
          {errors.email?.type === "required" && (
            <p className="text-danger">*Enter your email</p>
          )}
          {errors.email?.type === "pattern" && (
            <p className="text-danger">*Email should be valid</p>
          )}
        </div>

        <button className="d-block mx-auto btn btn-primary" type="submit">
          Sign In
        </button>
      </form>
    </Container>
  );
};

export default Signin;
