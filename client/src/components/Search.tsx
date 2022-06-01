import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Container, Input } from "reactstrap";
import IBlog from "../interfaces/blog";
import config from "../config/config";
import logging from "../config/logging";
import BlogPreview from "./BlogPreview";
import IUser from "../interfaces/user";
import Navigation from "./Navigation";
import Header from "./Header";
import ErrorText from "./ErrorText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [filteredResults, setFilteredResults] = useState<IBlog[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [error, setError] = useState<string>("");

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
        // console.log(enteredName, filteredData);
      } else {
        setFilteredResults(blogs);
        // console.log(blogs);
      }
    },
    [blogs]
  );

  return (
    <Container fluid className="p-0">
      <Container className="mt-5 mb-5">
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
    </Container>
  );
};

export default Search;
