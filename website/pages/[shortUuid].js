import React from "react";
import { useRouter } from "next/router";
import IndexPage from "../components/index/Page";
import getConfig from 'next/config'

export default function PostPage(props) {
  const router = useRouter();
  const { shortUuid } = router.query;
  return (
    <div>
      <IndexPage {...props} paletteData={props.sharedPostData} />
    </div>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const { serverRuntimeConfig } = getConfig()

  var cookies = {};
  const apiEndpoint = serverRuntimeConfig.apiEndpoint;

  const fetchSharedPost = await (
    await fetch(`${apiEndpoint}posts/id`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        shortUUID: query.shortUuid,
      }),
    })
  ).json();
  var sharedPostData = fetchSharedPost.data || [];

  if (
    Object.prototype.hasOwnProperty.call(req.headers, "cookie") &&
    typeof req.headers.cookie === "string"
  ) {
    req.headers.cookie.split(/\s*;\s*/).forEach(function (pair) {
      pair = pair.split(/\s*=\s*/);
      cookies[pair[0]] = pair.splice(1).join("=");
    });
  }

  if (cookies["palette-board-token"]) {
    /* It's a registered user */
    const fetchPosts = await (
      await fetch(`${apiEndpoint}posts`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${cookies["palette-board-token"]}`,
        }),
      })
    ).json();
    var posts = fetchPosts.data || [];

    const fetchUserData = await (
      await fetch(`${apiEndpoint}verifyToken`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${cookies["palette-board-token"]}`,
        }),
      })
    ).json();
    var userData = fetchUserData.data || [];

    return {
      props: {
        posts,
        userData,
        sharedPostData,
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
        sharedPostData,
      },
    };
  }
};
