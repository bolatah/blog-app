import IRoute from "../interfaces/route";
import BlogPage from "../pages/blog";
import EditPage from "../pages/edit";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import Test from "../pages/test";
const authRoutes: IRoute[] = [
  { name: "Login", path: "/login", auth: false, component: LoginPage },
  { name: "Register", path: "/register", auth: false, component: LoginPage },
];

const blogRoutes: IRoute[] = [
  { name: "Create", path: "/edit", auth: true, component: EditPage },
  { name: "Edit", path: "/edit/:blogID", auth: true, component: EditPage },
  { name: "Blog", path: "/blogs/:blogID", auth: false, component: BlogPage },
];

const mainRoutes: IRoute[] = [
  { name: "Home", path: "/", auth: false, component: HomePage },
  { name: "Test", path: "/test", auth: false, component: Test },
];

const routes: IRoute[] = [...authRoutes, ...blogRoutes, ...mainRoutes];

export default routes;
