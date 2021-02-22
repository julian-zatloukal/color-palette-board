import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useTheme } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';

import CreatePaletteDialog from "../components/createPalleteDialog/Dialog";
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
  dialogCard:{
    overflow: 'unset'
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Index({ posts, userData }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <div style={{overflowY: 'unset'}}>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
        maxWidth={"sm"}
        classes={{paper: classes.dialogCard}}
        
        >
         <CreatePaletteDialog handleCloseDialog={handleCloseDialog}/>
        </Dialog>
      </div>

      <Navbar userData={userData} />
      <main>
        <Header />

        <Container className={classes.cardGrid} maxWidth="md">
          <Fab
            style={{ marginLeft: "0rem", marginBottom: "2rem" }}
            variant="extended"
            onClick={handleClickOpenDialog}
            size="medium"
            color="primary"
            aria-label="add"
          >
            <AddIcon style={{ marginRight: "0.5rem" }} />
            Add Palette
          </Fab>
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
      },
    };
  } else {
    /* Show public version of the site */
    const res = await (await fetch(`${apiEndpoint}posts`)).json();
    var posts = res.data || [];
    return {
      props: {
        posts,
      },
    };
  }
};
