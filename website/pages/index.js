import React from "react";
import { useRouter } from "next/router";
import IndexPage from "../components/index/Page";

export default function HomePage(props) {
  return (
    <div>
      <IndexPage {...props}  />
    </div>
  );
}

export const getServerSideProps = async ({ req }) => {
  var cookies = {};
  const apiEndpoint = process.env.API_DOCKER_ROOT_ENDPOINT;

  req.headers.cookie.split(/\s*;\s*/).forEach(function (pair) {
    pair = pair.split(/\s*=\s*/);
    cookies[pair[0]] = pair.splice(1).join("=");
  });

  if (cookies["user-token"]) {
    /* It's a registered user */
    const fetchPosts = await (
      await fetch(`${apiEndpoint}posts`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${cookies["user-token"]}`,
        }),
      })
    ).json();
    var posts = fetchPosts.data || [];

    const fetchUserData = await (
      await fetch(`${apiEndpoint}verifyToken`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${cookies["user-token"]}`,
        }),
      })
    ).json();
    var userData = fetchUserData.data || [];

    return {
      props: {
        posts,
        userData,
      },
    };
  } else {
    /* Show public version of the site */
    const res = await (await fetch(`${apiEndpoint}posts`)).json();
    var posts = res.data || [];
    return {
      props: {
        posts,
        userData: null,
      },
    };
  }
};