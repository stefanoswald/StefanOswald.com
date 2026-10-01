import type { NextConfig } from "next";

// Find Stefan's Person is its own Vercel project (github.com/stefanoswald/find-stefans-person).
// These rewrites hand it everything under /MyPerson, so it shows up as stefanoswald.com/MyPerson.
const MY_PERSON_APP = "https://find-stefans-person.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html"
      },
      {
        source: "/MyPerson",
        destination: `${MY_PERSON_APP}/MyPerson`
      },
      {
        source: "/MyPerson/:path+",
        destination: `${MY_PERSON_APP}/MyPerson/:path+`
      }
    ];
  }
};

export default nextConfig;
