import React, { useState, useEffect } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit, FiDelete } from "react-icons/fi";
import ReactPaginate from "react-paginate";

import "./PostType.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [remove, setRemove] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // delete modal
  const [showClose, setShowClose] = useState(false);

  const handleCloseModal = () => setShowClose(false);
  const handleShowClose = () => setShowClose(true);

  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 3;

  const visitedPosts = currentPage * postsPerPage;

  const slicePages = posts?.slice(visitedPosts, visitedPosts + postsPerPage);

  const displayPostPage = () => {
    return (
      <>
        {slicePages.map((post) => (
          <Col sm={12} xl={4} className="p-2" key={post._id}>
            <div className="card card-relative h-100">
              <div className="card-header text-center">{post.title}</div>
              <div className="text-center mt-2">
                <img src={post.image} alt={post.title} className="post-image" />
              </div>
              <div className="card-body whitespace">
                {post.username === localStorage.getItem("user") ? (
                  <>
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <div className="text-secondary">You</div>
                      <div className="text-secondary m-1">
                        {post.updated === "true" ? (
                          <span> updated </span>
                        ) : (
                          <span> posted </span>
                        )}
                        this on {post.date}
                      </div>
                    </div>
                    <div className="mb-5">{post.context}</div>

                    {/* Create a modal to edit the post */}

                    <div className="d-flex gap-2 justify-content-end button-absolute">
                      <button
                        className="edit-delete-button d-block"
                        onClick={() =>
                          handleShow(post._id, post.title, post.context)
                        }
                      >
                        <FiEdit />
                      </button>
                      <Modal
                        show={show}
                        onHide={handleClose}
                        className="modal-font"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Edit your post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form onSubmit={handleSubmit(onFormSubmit)}>
                            <div className="mb-3">
                              <label htmlFor="title" className="form-label">
                                Title
                              </label>
                              <input
                                type="text"
                                id="title"
                                className="form-control"
                                defaultValue={title}
                                {...register("title", { required: true })}
                              />
                              {errors.title?.type === "required" && (
                                <p className="text-danger">*Enter your title</p>
                              )}
                            </div>

                            <div className="mb-3">
                              <label htmlFor="context" className="form-label">
                                Context
                              </label>
                              <textarea
                                id="context"
                                className="form-control"
                                rows={10}
                                defaultValue={context}
                                {...register("context", {
                                  required: true,
                                })}
                              />
                              {errors.context?.type === "required" && (
                                <p className="text-danger">
                                  *Enter your context
                                </p>
                              )}
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="d-block btn btn-warning"
                                onClick={handleClose}
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </Modal.Body>
                      </Modal>
                      <button
                        className="edit-delete-button d-block"
                        onClick={handleShowClose}
                      >
                        <FiDelete />
                      </button>

                      <Modal
                        show={showClose}
                        onHide={handleCloseModal}
                        className="modal-font"
                      >
                        <Modal.Body className="text-center text-dark">
                          Are you sure you want to delete this post?
                          <div className="d-flex justify-content-center gap-2 m-3">
                            <button
                              className="btn btn-warning"
                              onClick={handleCloseModal}
                            >
                              Close
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => onDelete(post._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <div className="text-primary">@{post.username}</div>
                      <div className="text-secondary m-1">
                        {post.updated === "true" ? (
                          <span> updated </span>
                        ) : (
                          <span> posted </span>
                        )}
                        this on {post.date}
                      </div>
                    </div>
                    <div>{post.context}</div>
                  </>
                )}
              </div>
            </div>
          </Col>
        ))}
      </>
    );
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleShow = (postId, title, context) => {
    setTitle(title);
    setContext(context);
    setId(postId);
    setShow(true);
  };

  useEffect(() => {
    if (!localStorage.getItem("isAuth")) {
      navigate("/login");
    }
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get("post/getallposts")
      .then((response) => {
        if (response.data.message === "found-posts") {
          setPosts(response.data.payload);
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch((err) => console.log(`Error Occured: ${err.message}`));
  }, [remove, edit]);

  const onDelete = (postId) => {
    axios
      .delete(`/post/deletepost/${postId}`)
      .then(() => {
        setRemove(!remove);
      })
      .catch((err) => console.log(`Error Occured: ${err.message}`));

    handleCloseModal();
  };

  const addPosts = () => {
    navigate("/createpost");
  };

  const onFormSubmit = (updatedPost) => {
    updatedPost._id = id;

    updatedPost.username = localStorage.getItem("user");

    axios
      .put("/post/editpost", updatedPost)
      .then(() => {
        setEdit(!edit);
      })
      .catch((err) => console.log(`Error Occured : ${err.message}`));
  };

  const pageCount = Math.ceil(posts.length / postsPerPage);

  const onChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <h3 className="text-center mt-4">All Posts</h3>
      {loading ? (
        <div class="d-flex justify-content-center text-primary m-5">
          <div class="spinner-border" role="status"></div>
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <>
              <Row className="justify-content-center mb-3">
                {displayPostPage()}
              </Row>

              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                pageCount={pageCount}
                onPageChange={onChange}
                containerClassName={"paginationbuttons"}
                previousLinkClassName={"previousbutton"}
                nextLinkClassName={"nextbutton"}
                disabledClassName={"paginationdisabled"}
                activeClassName={"paginationactive"}
              />
            </>
          ) : (
            <div class="alert alert-primary m-3" role="alert">
              <h4 className="text-center m-2">There are no posts!</h4>
              <button
                className="d-block mx-auto btn btn-primary m-3"
                onClick={addPosts}
              >
                Add posts
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AllPosts;
