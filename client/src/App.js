import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FcLike } from "react-icons/fc";
import {
  FiLinkedin,
  FiInstagram,
  FiBookmark,
  FiLogIn,
  FiUser,
  FiMessageSquare,
  FiInbox,
  FiEdit,
} from "react-icons/fi";
import { VscGithubInverted } from "react-icons/vsc";

import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signin from "./components/Signin/Signin";
import CreatePost from "./components/Posts/CreatePost";
import UserPosts from "./components/PostType/UserPosts";

import AllPosts from "./components/PostType/AllPosts";
import MyPosts from "./components/PostType/MyPosts";

import { clearLoginStatus } from "./slices/UserSlice";
import { clearAuthStatus } from "./slices/AuthSlice";
import { authUser } from "./slices/AuthSlice";

import "./App.css";
import axios from "axios";

const App = () => {
  const { isSuccess } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const logout = () => {
    localStorage.clear();
    dispatch(clearLoginStatus());
    dispatch(clearAuthStatus());
    navigate("/");
  };

  // keep user logged in even after page reload
  useEffect(() => {
    let jwtToken = { token: localStorage.getItem("token") };

    if (jwtToken.token) {
      dispatch(authUser(jwtToken));
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    axios
      .get("/user/getusers")
      .then((response) => {
        if (response.data.message === "users found") {
          setUsers(response.data.payload);
        }
      })
      .catch((err) => console.log(err.message));
  }, []);

  const onUserSearch = (e) => {
    setSearchUsers(
      users.filter((user) => user.username.startsWith(e.target.value))
    );

    if (e.target.value === "") {
      setShowUsers(false);
    } else {
      setShowUsers(true);
    }
  };

  const selectUser = (username) => {
    localStorage.setItem("search-user", username);

    navigate("/userposts");
  };

  return (
    <>
      <div className="bg-image">
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          sticky="top"
        >
          <Container>
            <NavLink className="navbar-brand" to="/">
              <div className="d-flex align-items-center">
                <div>
                  <FiBookmark />
                </div>
                <div>Blogger</div>
              </div>
            </NavLink>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              {localStorage.getItem("isAuth") ? (
                <>
                  <Nav className="me-auto gap-2">
                    <NavLink className="nav-link" to="/allposts">
                      <div className="d-flex align-items-center gap-1">
                        <div>
                          <FiMessageSquare />
                        </div>
                        <div>All Posts</div>
                      </div>
                    </NavLink>
                    <NavLink className="nav-link" to="/myposts">
                      <div className="d-flex align-items-center gap-1">
                        <div>
                          <FiInbox />
                        </div>
                        <div>My Posts</div>
                      </div>
                    </NavLink>
                    <NavLink className="nav-link" to="/createpost">
                      <div className="d-flex align-items-center gap-1">
                        <div>
                          <FiEdit />
                        </div>
                        <div>Create Post</div>
                      </div>
                    </NavLink>
                  </Nav>
                  <Nav className="ms-auto align-items-center gap-3">
                    <form>
                      <div className="d-flex gap-2">
                        <div className="form-input-list">
                          <input
                            type="text"
                            id="user"
                            placeholder="Search Users"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => onUserSearch(e)}
                          />
                          {searchUsers.length > 0
                            ? showUsers && (
                                <div className="users-list text-primary">
                                  {searchUsers.map((user) => (
                                    <div key={user._id}>
                                      <button
                                        className="search-user-links"
                                        onClick={() =>
                                          selectUser(user.username)
                                        }
                                      >
                                        <div className="p-1 text-start">
                                          {user.username}
                                        </div>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )
                            : showUsers && (
                                <div className="users text-primary">
                                  <div className="no-user">
                                    <div className="p-2 text-start">
                                      No such user
                                    </div>
                                  </div>
                                </div>
                              )}
                        </div>
                      </div>
                    </form>
                    <div className="text-secondary">
                      <div className="d-flex align-items-center gap-1">
                        <div>
                          <FiUser />
                        </div>
                        <div>{localStorage.getItem("user")}</div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary button-width"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </Nav>
                </>
              ) : (
                <Nav className="ms-auto gap-2">
                  <NavLink className="nav-link" to="/login">
                    <div className="d-flex align-items-center gap-1">
                      <div>
                        <FiLogIn />
                      </div>
                      <div>Login</div>
                    </div>
                  </NavLink>
                  <NavLink className="nav-link" to="/signin">
                    <div className="d-flex align-items-center gap-1">
                      <div>
                        <FiUser />
                      </div>
                      <div>Sign In</div>
                    </div>
                  </NavLink>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/allposts" element={<AllPosts />} />
            <Route path="/userposts" element={<UserPosts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/createpost" element={<CreatePost />} />
          </Routes>
        </Container>
      </div>
      <footer className="text-center text-lg-start bg-dark text-white">
        <Container>
          <Row className="p-3 text-center text-secondary text-size">
            <Col sm={12} md={6}>
              Made with <FcLike /> by
              <a
                href="mailto:sathvik.marni@gmail.com"
                className="mail-link text-light"
              >
                {" "}
                sathvik
              </a>
            </Col>
            <Col sm={12} md={6} className="d-flex justify-content-center">
              <a
                href="https://github.com/sathvik-Marni"
                target="_blank"
                rel="noreferrer"
                className="d-block me-3 icon"
              >
                <VscGithubInverted />
              </a>
              <a
                href="https://www.linkedin.com/in/sathvik-marni-7147391b4/"
                target="_blank"
                rel="noreferrer"
                className="d-block ms-3 me-3 icon"
              >
                <FiLinkedin />
              </a>
              <a
                href="https://www.instagram.com/sathvik_marni/"
                target="_blank"
                rel="noreferrer"
                className="d-block ms-3 icon"
              >
                <FiInstagram />
              </a>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default App;
