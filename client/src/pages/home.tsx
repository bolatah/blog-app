import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Input } from "reactstrap";
import BlogPreview from "../components/BlogPreview";
import ErrorText from "../components/ErrorText";
import Header from "../components/Header";
import LoadingComponent from "../components/LoadingComponent";
import Navigation from "../components/Navigation";
import config from "../config/config";
import logging from "../config/logging";
import IBlog from "../interfaces/blog";
import IPageProps from "../interfaces/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import IUser from "../interfaces/user";

//import Search from "../components/Search";

const HomePage: React.FC<IPageProps> = (props) => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [filteredResults, setFilteredResults] = useState<IBlog[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // GetAllBlogs is going to be async because it is calling the api

  useEffect(() => {
    GetAllBlogs();
  }, []);

  const GetAllBlogs = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.server.url}/blogs`,
      });
      if (response.status === 200 || 304) {
        let blogs = response.data.blogs as IBlog[];
        blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
        setBlogs(blogs);
      }
    } catch (error) {
      logging.error(error);
      setError("Unable to retrieve blogs");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const searchBlogs = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredName = e.target.value;
      setSearchInput(enteredName);
      if (enteredName.length > 0) {
        const filteredData = blogs.filter((blog) => {
          return Object.values(blog.title || blog.headline)
            .join("")
            .toLowerCase()
            .includes(enteredName.toLowerCase());
        });
        setFilteredResults(filteredData);
      } else {
        setFilteredResults(blogs);
      }
    },
    [blogs]
  );

  if (loading) {
    return <LoadingComponent> Loading blogs...</LoadingComponent>;
  }

  return (
    <>
      <Navigation />
      <Header title="Open Blog" headline="Let`s start the journey" />
      <Container className="mt-5">
        {blogs.length === 0 && (
          <p>
            There are no blogs yet, you should <Link to="/edit"> post</Link>{" "}
            one.
          </p>
        )}
        {/*     <Search /> */}
        <div className="search-bar">
          <div>
            <FontAwesomeIcon
              className="fa-lg"
              style={{ color: "#3a98db", marginRight: "1rem" }}
              icon={faMagnifyingGlass}
            />{" "}
          </div>
          <Input
            value={searchInput}
            className="search-bar"
            id="search"
            name="search"
            placeholder="Search in the blogs"
            type="search"
            onChange={searchBlogs}
          />
        </div>

        {searchInput.length > 0
          ? filteredResults.map((blog, index: number) => {
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
            })
          : blogs.map((blog, index) => {
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
    </>
  );
};

export default HomePage;
