/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["reactstrap"]);
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
module.exports = withTM();
