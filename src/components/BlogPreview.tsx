import React, { ReactNode } from "react";
import Link from "next/link";
import { Card, CardBody } from "reactstrap";
import styles from "../styles/custom.module.css";

export interface IBlogPreviewProps {
  _id: string;
  title: string;
  headline: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  children?: ReactNode;
}

const BlogPreview: React.FC<IBlogPreviewProps> = (props) => {
  const { _id, title, headline, children, author, createdAt, updatedAt } =
    props;
  return (
    <Card className="border-0" style={{ backgroundColor: "#eee2dc" }}>
      <CardBody className="p-3">
        <Link
          href={`/blogs/${_id}`}
          style={{ textDecoration: "none" }}
          className="text-primary"
        >
          <h2 className={styles.blogPreviewText}>
            <strong>{title}</strong>
          </h2>
          <h4 className={styles.blogPreviewText}>{headline}</h4> <br />
        </Link>
        {createdAt !== updatedAt ? (
          <p>
            Updated by {author} at {new Date(updatedAt).toLocaleString()}
          </p>
        ) : (
          <p>
            Posted by {author} at {new Date(createdAt).toLocaleString()}
          </p>
        )}
        {children}
      </CardBody>
    </Card>
  );
};
export default BlogPreview;
