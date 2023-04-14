export default interface IRoute {
  path: string;
  name: string;
  auth: boolean;
  component: any;
  element?: any;
  props?: any;
}
