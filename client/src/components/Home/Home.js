import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import undraw_blogging from "../../assets/images/undraw_blogging.svg";
import undraw_publish from "../../assets/images/undraw_publish.svg";

import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const createBlog = () => {
    navigate("/createpost");
  };

  const viewposts = () => {
    navigate("/allposts");
  };

  return (
    <Container fluid>
      <Row className="align-items-center mb-4">
        <Col sm={12} md={6}>
          <img
            src={undraw_blogging}
            alt="undraw_blogging"
            className="blog-svg-xlarge mx-auto svg d-none d-xl-block"
          />

          <img
            src={undraw_blogging}
            alt="undraw_blogging"
            className="blog-svg-large mx-auto svg d-none d-lg-block d-xl-none"
          />

          <img
            src={undraw_blogging}
            alt="undraw_blogging"
            className="blog-svg-med mx-auto svg d-none d-md-block d-lg-none"
          />

          <img
            src={undraw_blogging}
            alt="undraw_blogging"
            className="blog-svg-small mx-auto svg d-block d-md-none"
          />
        </Col>
        <Col sm={12} md={6}>
          <div className="text-primary text-center display-4">
            Share Your Experiences
          </div>

          <button
            className="d-block mx-auto btn btn-primary m-3"
            onClick={createBlog}
          >
            Create Your Post
          </button>
        </Col>
      </Row>

      <Row className="align-items-center mb-4">
        <Col sm={12} md={6} className="d-none d-md-block">
          <div className="text-dark text-center display-4">
            Make your adventure
          </div>

          <button
            className="d-block mx-auto btn btn-warning m-3"
            onClick={viewposts}
          >
            View Posts
          </button>
        </Col>

        <Col sm={12} md={6}>
          <img
            src={undraw_publish}
            alt="undraw_publish"
            className="publish-svg-xlarge mx-auto svg d-none d-xl-block"
          />

          <img
            src={undraw_publish}
            alt="undraw_publish"
            className="publish-svg-large mx-auto svg d-none d-lg-block d-xl-none"
          />

          <img
            src={undraw_publish}
            alt="undraw_publish"
            className="publish-svg-med mx-auto svg d-none d-md-block d-lg-none"
          />

          <img
            src={undraw_publish}
            alt="undraw_publish"
            className="publish-svg-small mx-auto svg d-block d-md-none"
          />
        </Col>

        <Col sm={12} md={6} className="d-block d-md-none mb-4">
          <div className="text-dark text-center display-4">
            Make your adventure
          </div>

          <button
            className="d-block mx-auto btn btn-warning m-3"
            onClick={viewposts}
          >
            view posts
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
