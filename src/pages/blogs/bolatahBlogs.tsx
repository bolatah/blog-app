import axios from "axios";
import { Container } from "reactstrap";
import BlogPreview from "../../components/BlogPreview";
import Header from "../../components/Header";
import { IBlog } from "../../interfaces/blog";
import { IUser } from "../../interfaces/user";
import { GetServerSideProps } from "next";
import Navigation from "@/components/Navigation";

type Props = {
  blogs: IBlog[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/readBolatahBlogs`
    );
    if (response.status === 200 || response.status === 304) {
      let blogs = response.data as IBlog[];
      blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
      return {
        props: { blogs },
      };
    } else {
      return { props: { blogs: [] } };
    }
  } catch (error) {
    console.log(error);

    return { props: { blogs: [] } };
  }
};

const BolatahBlogs = ({ blogs }: any) => {
  return (
    <>
      <Navigation />
      <Header title="Open Blog" headline="Let`s start the journey" />
      <Container fluid className="p-0">
        <Container className="mt-5 mb-5">
          {blogs.map(
            (
              blog: {
                _id: string;
                title: string;
                headline: string;
                author: IUser;
                createdAt: string;
                updatedAt: string;
              },
              index: number
            ) => {
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
            }
          )}
        </Container>
      </Container>
    </>
  );
};

export default BolatahBlogs;
