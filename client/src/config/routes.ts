import IRoute from "../interfaces/route";
import BlogPage from "../pages/blog";
import EditPage from "../pages/edit";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";

const authRoutes: IRoute[] = [
  {
    path: "/login",
    auth: false,
    component: LoginPage,
    name: "Login",
  },
  {
    path: "/register",
    auth: false,
    component: LoginPage,
    name: "Register",
  },
];

const blogRoutes: IRoute[] = [
  {
    path: "/edit",
    auth: true,
    component: EditPage,
    name: "Edit",
  },
  {
    path: "/edit/:blogID",
    auth: true,
    component: EditPage,
    name: "Edit",
  },
  {
    path: "/blogs/:blogID",
    auth: false,
    component: BlogPage,
    name: "Blog",
  },
];

const mainRoutes: IRoute[] = [
  {
    path: "/",
    auth: false,
    component: HomePage,
    name: "Home",
  },
];

const routes: IRoute[] = [...authRoutes, ...blogRoutes, ...mainRoutes];

export default routes;
