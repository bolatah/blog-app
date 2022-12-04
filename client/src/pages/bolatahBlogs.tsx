import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import BlogPreview from "../components/BlogPreview";
import ErrorText from "../components/ErrorText";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import config from "../config/config";
import logging from "../config/logging";
import IBlog from "../interfaces/blog";
import IPageProps from "../interfaces/page";
import IUser from "../interfaces/user";

const BolatahBlogs: React.FC<IPageProps> = (_props) => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    GetAllBlogs();
  }, []);

  const GetAllBlogs = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.server.url}/blogs/readBolatah`,
      });
      if (response.status === 200 || 304) {
        let blogs = response.data.blogs as IBlog[];
        blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
        setBlogs(blogs);
      }
    } catch (error) {
      logging.error(error);
      setError("Unable to retrieve blogs");
    }
  };
  return (
    <>
      <Navigation />
      <Header title="Open Blog" headline="Let`s start the journey" />
      <Container fluid className="p-0">
        <Container className="mt-5 mb-5">
          {blogs.map((blog, index: number) => {
            return (
              <div key={index}>
                <BlogPreview
                  _id={blog._id}
                  title={blog.title}
                  headline={blog.headline}
                  author={(blog.author as IUser).name}
                  createdAt={blog.createdAt}
                  updatedAt={blog.updatedAt}
                />
                <hr />
              </div>
            );
          })}
          <ErrorText error={error} />
        </Container>
      </Container>
    </>
  );
};

export default BolatahBlogs;
