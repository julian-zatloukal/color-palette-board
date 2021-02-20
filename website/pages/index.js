import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { useTheme } from "@material-ui/core/styles";

import Post from "../components/post/post";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: "1rem",
  },
  cardGrid: {
    paddingTop: "3rem",
    paddingBottom: "1rem",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Index({ posts }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <main>
        <Header />

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {posts.map((post, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Post data={post} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export const getServerSideProps = async ({ req }) => {
  var cookies = {};
  const apiEndpoint = process.env.API_DOCKER_ROOT_ENDPOINT;

  req.headers.cookie.split(/\s*;\s*/).forEach(function (pair) {
    pair = pair.split(/\s*=\s*/);
    cookies[pair[0]] = pair.splice(1).join("=");
  });

  if (cookies["palette-board-token"]) {
    const res = await (await fetch(`${apiEndpoint}posts`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${cookies["palette-board-token"]}`, 
      }), 
    })).json();
    var posts = res.data || [];
    return {
      props: {
        posts,
      },
    };

  } else {
    const res = await (await fetch(`${apiEndpoint}posts`)).json();
    var posts = res.data || [];
    return {
      props: {
        posts,
      },
    };
  }
};
