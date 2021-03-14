const Cookies = require("js-cookie");

const apiRoot = process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
  ? process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
  : window.location.origin + "/api/";
const getUserToken = () => Cookies.get("user-token");
const debugLog = (log) => {
  if (process.env.NODE_ENV === "development") {
    console.log("%c[DEBUG]", "color: blue", log);
  }
};

const apiRequests = {
  login: async (username, password) => {
    try {
      let response = await fetch(apiRoot + "login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        var formattedResponse = await response.json();
      }
    } catch (ex) {
      throw Error("Se ha producido un error.");
    }

    if (formattedResponse.status === "OK") {
      return formattedResponse.token;
    } else {
      throw new Error("Usuario o contraseña incorrectos.");
    }
  },
  getAllPosts: async () => {
    try {
      var response = {};
      var formattedResponse = {};
      if (getUserToken()) {
        response = await fetch(`${apiRoot}posts`, {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${getUserToken()}`,
          }),
        });
      } else {
        response = await fetch(`${originUrl}posts`);
      }

      if (response.ok) {
        formattedResponse = await response.json();
      } else {
        throw Error("Couldn't retrieve posts.");
      }
    } catch (ex) {
      throw Error("Couldn't retrieve posts.");
    }

    if (
      Object.prototype.hasOwnProperty.call(formattedResponse, "status") &&
      formattedResponse.status === "OK"
    ) {
      return formattedResponse.data;
    } else {
      throw new Error("Couldn't retrieve posts.");
    }
  },
  getUserData: async () => {
    var formattedResponse = {};
    try {
      let response = await fetch(`${apiRoot}verifyToken`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${getUserToken()}`,
        }),
      });

      if (response.ok) {
        formattedResponse = await response.json();
      } else {
        throw Error("Couldn't retrieve user data.");
      }
    } catch (ex) {
      throw Error("Couldn't retrieve user data.");
    }

    if (
      Object.prototype.hasOwnProperty.call(formattedResponse, "status") &&
      formattedResponse.status === "OK"
    ) {
      return formattedResponse.data;
    } else {
      throw new Error("Couldn't retrieve user data.");
    }
  },
  postLikeStatus: async (postUuid, action) => {
    var formattedResponse = {};
    try {
      let response = await fetch(`${apiRoot}posts/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shortUUID: postUuid,
          action: action ? "like" : "dislike",
        }),
      });

      if (response.ok) {
        formattedResponse = await response.json();
      } else {
        throw Error("Couldn't change the like of post.");
      }
    } catch (ex) {
      throw Error("Couldn't change the like of post.");
    }

    if (
      Object.prototype.hasOwnProperty.call(formattedResponse, "status") &&
      formattedResponse.status === "OK"
    ) {
      return formattedResponse.data;
    } else {
      throw new Error("Couldn't change the like of post.");
    }
  },
  submitPost: async (palette) => {
    var formattedResponse = {};
    try {
      let response = await fetch(`${apiRoot}posts/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("user-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          palette: palette,
        }),
      });

      if (response.ok) {
        formattedResponse = await response.json();
      } else {
        throw Error("Couldn't submit post.");
      }
    } catch (ex) {
      throw Error("Couldn't submit post.");
    }

    if (
      Object.prototype.hasOwnProperty.call(formattedResponse, "status") &&
      formattedResponse.status === "OK"
    ) {
      return true;
    } else {
      throw new Error("Couldn't submit post.");
    }
  },
  deletePost: async (shortUuid) => {
    var formattedResponse = {};
    try {
      let response = await fetch(`${apiRoot}posts/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shortUUID: shortUuid,
        }),
      });

      if (response.ok) {
        formattedResponse = await response.json();
      } else {
        throw Error("Couldn't delete post.");
      }
    } catch (ex) {
      throw Error("Couldn't delete post.");
    }

    if (
      Object.prototype.hasOwnProperty.call(formattedResponse, "status") &&
      formattedResponse.status === "OK"
    ) {
      return true;
    } else {
      throw new Error("Couldn't delete post.");
    }
  }
};

export const {
  login,
  getAllPosts,
  getUserData,
  postLikeStatus,
  submitPost,
  deletePost,
} = apiRequests;
