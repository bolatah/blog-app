import axios from "axios";
import React, { useContext, useState } from "react";
import { Loading } from "../../components/LoadingComponent";
import Link from "next/link";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Navigation from "../../components/Navigation";
import ErrorText from "../../components/ErrorText";
import Header from "../../components/Header";
import UserContext from "../../contexts/user";
import { IBlogClient } from "../../interfaces/blog";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import logging from "@/config/logging";
import styled from "styled-components";

type Props = {
  blog: IBlogClient | null;
};
const ButtonDelete = styled.button`
  margin-left: 1rem;
  background-color: #dc3545;
  border-radius: 10%;
  color: white;
  padding: 7px 13px;
  border: none;
  cursor: pointer;
`;

const ButtonEdit = styled.button`
  margin-left: 1rem;
  background-color: red;
  border-radius: 10%;
  background-color: #007bff;
  color: white;
  padding: 7px 13px;
  border: none;
  cursor: pointer;
`;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  try {
    const { id } = context.query;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`
    );

    if (response.status === 200 || 304) {
      let blog = response.data as IBlogClient;
      return {
        props: { blog, revalidate: 15 },
      };
    } else {
      return { props: { blog: null } };
    }
  } catch (error) {
    logging.error(error);

    return { props: { blog: null } };
  }
};

const BlogPage = ({ blog }: Props) => {
  const [error, setError] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useContext(UserContext).userState;

  const deleteBlog = async () => {
    setDeleting(true);
    const { id } = router.query;
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`,
      });

      if (response.status === 200) {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(`Unable to delete blog ${id}`);
        setDeleting(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setDeleting(false);
      }
    }
  };

  if (blog) {
    return (
      <Container fluid className="p-0">
        <Navigation />

        <Modal isOpen={modal}>
          <ModalHeader>Delete</ModalHeader>
          <ModalBody>
            {deleting ? <Loading /> : "Are you sure you want to delete?"}
            <ErrorText error={error} />
          </ModalBody>
          <ModalFooter>
            <button
              color="danger"
              onClick={() => {
                deleteBlog();
                setModal(false);
              }}
            >
              Delete Permanently
            </button>
            <button color="secondary" onClick={() => setModal(false)}>
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Header
          image={blog.picture || undefined}
          title={blog.title}
          headline={blog.headline}
        >
          <p className="text-white">
            Posted by {blog.author.name} on{" "}
            {new Date(blog.createdAt).toLocaleString()}
          </p>
        </Header>
        <Container className="mt-5">
          {user._id === blog.author._id && (
            <Container fluid className="p-0">
              <Link href={`/blogs/edit/${blog._id}`}>
                <ButtonEdit>
                  <i className="fas fa-edit mr-2"></i>Edit
                </ButtonEdit>
              </Link>

              <ButtonDelete onClick={() => setModal(true)}>
                <i className="far fa-trash-alt mr-2"></i>Delete
              </ButtonDelete>
              <hr />
            </Container>
          )}

          <ErrorText error={error} />
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </Container>
      </Container>
    );
  } else {
    return <Link href={"/"}></Link>;
  }
};

export default BlogPage;
