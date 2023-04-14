import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Container, Input } from "reactstrap";
import BlogPreview from "../../components/BlogPreview";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import logging from "../../config/logging";
import { IBlogClient } from "../../interfaces/blog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { IUserClient } from "../../interfaces/user";
import { GetServerSideProps } from "next";
import styles from "../../styles/custom.module.css";

type Props = {
  blogs: IBlogClient[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/blogs/readAll");

    if (response.status === 200 || 304) {
      let blogs = response.data as IBlogClient[];
      blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
      return {
        props: { blogs },
      };
    } else {
      return { props: { blogs: [] } };
    }
  } catch (error) {
    logging.error(error);

    return { props: { blogs: [] } };
  }
};

const HomePage = ({ blogs }: Props) => {
  const [filteredResults, setFilteredResults] = useState<IBlogClient[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

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

  return (
    <>
      <Navigation />
      <Header title="Open Blog" headline="Let`s start the journey" />
      <Container className="mt-5">
        {blogs.length === 0 && (
          <p>
            There are no blogs yet, you should
            <Link href="/blogs/edit"> post</Link>
            one.
          </p>
        )}

        <div className={styles.searchBar}>
          <div className={styles.textInSearchBar}>
            <FontAwesomeIcon className="fa-lg" icon={faMagnifyingGlass} />
          </div>
          <Input
            value={searchInput}
            className={styles.searchBar}
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
                    author={(blog.author as IUserClient).name}
                    createdAt={blog.createdAt}
                    updatedAt={blog.updatedAt}
                  />
                  <hr />
                </div>
              );
            })
          : blogs &&
            blogs.map((blog, index) => {
              return (
                <div key={index}>
                  <BlogPreview
                    _id={blog._id}
                    title={blog.title}
                    headline={blog.headline}
                    author={(blog.author as IUserClient).name}
                    createdAt={blog.createdAt}
                    updatedAt={blog.updatedAt}
                  />
                  <hr />
                </div>
              );
            })}
      </Container>
    </>
  );
};

export default HomePage;
