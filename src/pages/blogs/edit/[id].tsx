import React, { FC, useContext, useEffect, useState } from "react";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import ErrorText from "../../../components/ErrorText";
import Header from "../../../components/Header";
import Navigation from "../../../components/Navigation";
import config from "../../../config/config";
import logging from "../../../config/logging";
import UserContext from "../../../contexts/user";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import SuccessText from "../../../components/Success";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
import AuthRoute from "../../../components/AuthRoute";
import dynamic from "next/dynamic";
import { IBlogClient } from "@/interfaces/blog";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
) as React.ComponentType<any>;

async function getHtmlToDraftModule() {
  const htmlToDraftModule = await import("html-to-draftjs");
  return htmlToDraftModule.default;
}

async function convertHtmlToDraft(html: string) {
  const htmlToDraft = await getHtmlToDraftModule();
  return htmlToDraft(html);
}

const EditPage: FC = () => {
  const [idParam, setIdParam] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user } = useContext(UserContext).userState;
  const router: NextRouter = useRouter();
  let { id } = router.query;

  useEffect(() => {
    if (id && typeof id === "string") {
      setIdParam(id);
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (idParam !== "") {
      getBlog();
    } else {
    }
  }, [idParam]);

  const getBlog = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${idParam}`,
      });

      if (response.status === (200 || 304)) {
        if (user._id !== response.data.author._id) {
          logging.warn(`This blog is owned by someone else.`);
          setIdParam("");
        } else {
          setTitle(response.data.title);
          setContent(response.data.content);
          setHeadline(response.data.headline);
          setPicture(response.data.picture || "");

          /** Convert html string to draft JS */
          const contentBlock = await convertHtmlToDraft(response.data.content);
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorState = EditorState.createWithContent(contentState);

          setEditorState(editorState);
        }
      } else {
        setError(`Unable to retrieve blog ${idParam}`);
        setIdParam("");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      /* setLoading(false); */
    }
  };

  const editBlog = async () => {
    if (title === "" || headline === "" || content === "") {
      setError("Please fill out all fields.");
      setSuccess("");
      return null;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await axios({
        method: "PATCH",
        url: `${config.server.url}/blogs/edit/${idParam}`,
        data: {
          title,
          picture,
          headline,
          content,
        },
      });

      if (response.status === 201) {
        setSuccess("Blog updated.");
      } else {
        setError(`Unable to save blog.`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const createBlog = async () => {
    if (title === "" || headline === "" || content === "") {
      setError("Please fill out all fields.");
      setSuccess("");
      return null;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await axios({
        method: "POST",
        url: `${config.server.url}/blogs/create`,
        data: {
          title,
          picture,
          headline,
          content,
          author: user._id,
        },
      });

      if (response.status === 201) {
        setIdParam(response.data.blog.title);
        setSuccess("Blog posted. You can continue to edit on this page.");
      } else {
        setError(`Unable to save blog.`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthRoute>
      <Container fluid className="p-0">
        <Navigation />
        <Header
          image="https://startbootstrap.github.io/startbootstrap-clean-blog/img/home-bg.jpg"
          headline=""
          title={idParam !== "" ? "Edit Your Blog" : "Create a Blog"}
        />
        <Container className="mt-5 mb-5">
          <ErrorText error={error} />
          <Form>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                value={title}
                id="title"
                placeholder="Enter a title"
                disabled={saving}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                style={{ backgroundColor: "#eee2dc" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="picture">Picture URL</Label>
              <Input
                type="text"
                name="picture"
                value={picture}
                id="picture"
                placeholder="Picture URL"
                disabled={saving}
                onChange={(event) => {
                  setPicture(event.target.value);
                }}
                style={{ backgroundColor: "#eee2dc" }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="headline">Headline</Label>
              <Input
                type="text"
                name="headline"
                value={headline}
                id="headline"
                placeholder="Enter a headline"
                disabled={saving}
                onChange={(event) => {
                  setHeadline(event.target.value);
                }}
                style={{ backgroundColor: "#eee2dc" }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Content</Label>
              <Editor
                editorStyle={{
                  backgroundColor: "#eee2dc",
                }}
                editorState={editorState}
                onEditorStateChange={(newState: any) => {
                  setEditorState(newState);
                  setContent(
                    draftToHtml(convertToRaw(newState.getCurrentContent()))
                  );
                }}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "list",
                    "textAlign",
                    "history",
                    "embedded",
                    "emoji",
                    "image",
                  ],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true },
                }}
              />
            </FormGroup>
            <FormGroup>
              <SuccessText success={success} />
            </FormGroup>
            <FormGroup>
              <Button
                block
                onClick={() => {
                  if (idParam !== "") {
                    editBlog();
                  } else {
                    createBlog();
                  }
                }}
                disabled={saving}
              >
                <i className="fas fa-save mr-1"></i>
                {idParam !== "" ? "Update" : "Post"}
              </Button>
              {idParam !== "" && (
                <Link href={`/blogs/${idParam}`}>
                  <Button block color="success">
                    Go to your blog post!
                  </Button>
                </Link>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Preview</Label>
              <div className="border ql-container p-2">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
            </FormGroup>
          </Form>
          <ErrorText error={error} />
        </Container>
      </Container>
    </AuthRoute>
  );
};

export default EditPage;
