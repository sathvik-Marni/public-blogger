import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";

import "./PostType.css";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 3;

  const pagesVisited = currentPage * postsPerPage;

  const displayPosts = posts?.slice(pagesVisited, pagesVisited + postsPerPage);

  const displayPostPage = () => {
    return (
      <>
        {displayPosts.map((post) => (
          <Col sm={12} xl={4} className="p-2" key={post._id}>
            <div className="card h-100">
              <div className="card-header card-relative text-center">
                {post.title}
              </div>

              <div className="text-center mt-2">
                <img src={post.image} alt={post.title} className="post-image" />
              </div>

              <div className="card-body whitespace">
                <div className="mt-2 mb-2">
                  {post.updated === "false" ? (
                    <div className="text-secondary">posted on {post.date}</div>
                  ) : (
                    <div className="text-secondary">updated on {post.date}</div>
                  )}
                </div>

                <div className="mb-5">{post.context}</div>
              </div>
            </div>
          </Col>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (!localStorage.getItem("isAuth")) {
      navigate("/login");
    }
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`post/getmyposts/${localStorage.getItem("search-user")}`)
      .then((response) => {
        if (response.data.message === "found-posts") {
          setPosts(response.data.payload);
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch((err) => console.log(`Error Occured: ${err.message}`));
  }, []);

  const addPosts = () => {
    navigate("/createpost");
  };

  const noOfPages = Math.ceil(posts.length / postsPerPage);

  const onChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <h3 className="text-center mt-4">
        {localStorage.getItem("search-user")}'s Posts
      </h3>
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
                pageCount={noOfPages}
                onPageChange={onChange}
                containerClassName={"paginationbuttons"}
                previousLinkClassName={"previousbutton"}
                nextLinkClassName={"nextbutton"}
                disabledClassName={"paginationdisabled"}
                activeClassName={"paginationactive"}
              />
              <button
                className="d-block mx-auto btn btn-primary m-2"
                onClick={addPosts}
              >
                Add posts
              </button>
            </>
          ) : (
            <div class="alert alert-primary m-3" role="alert">
              <h4 className="text-center m-2 p-3">
                {localStorage.getItem("search-user")} doesn't have any posts!
              </h4>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserPosts;
