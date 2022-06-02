import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../slices/PostSlice";

import "./CreatePost.css";

const Posts = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [context, setContext] = useState(false);

  const [img, setImg] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onFormSubmit = (postDataObj) => {
    let postContext = postDataObj.context;

    postContext = postContext.replace(/^[ \r\n]+$/gi, "");

    if (postContext === "") {
      setContext(true);
    } else {
      setContext(false);

      postDataObj.username = user;

      postDataObj.updated = "false";

      let formData = new FormData();

      formData.append("userObj", JSON.stringify(postDataObj));

      formData.append("image", img);

      dispatch(createPost(formData));

      navigate("/myposts");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("isAuth")) {
      navigate("/login");
    }
  });

  const onImageSelect = (event) => {
    setImg(event.target.files[0]);
  };

  return (
    <>
      <h3 className="text-center m-4">Create a Post</h3>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="post-form-width mx-auto bg-light border border-dark rounded p-3 mb-4"
      >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            {...register("title", { required: true })}
          />
          {errors.title?.type === "required" && (
            <p className="text-danger">*Enter your title</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="context" className="form-lable">
            Context
          </label>
          <textarea
            id="context"
            rows="10"
            className="form-control"
            {...register("context", { required: true })}
          />
          {errors.context?.type === "required" && (
            <p className="text-danger">*Enter your context</p>
          )}
          {context && (
            <p className="text-danger">*Cannot add only empty lines</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload an Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="form-control"
            {...register("image", { required: true })}
            onChange={(event) => onImageSelect(event)}
          />
          {errors.image?.type === "required" && (
            <p className="text-danger">*Add an image for your post</p>
          )}
        </div>

        <button className="d-block mx-auto btn btn-primary" type="submit">
          Post It!
        </button>
      </form>
    </>
  );
};

export default Posts;
