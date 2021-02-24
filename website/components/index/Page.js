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
import Dialog from "@material-ui/core/Dialog";
import Cookies from "js-cookie";

import CreatePaletteDialog from "../createPalleteDialog/Dialog";
import ShowPostDialog from "../postPage/ShowPostDialog";
import Post from "../post/post";
import Navbar from "../index/Navbar";
import Header from "../index/Header";
import Footer from "../index/Footer";

import { useSelector, useDispatch } from "react-redux";
import { updateUserData, updateIsUserLogged } from "../utils/userDataSlice";

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
  dialogCard: {
    overflow: "unset",
  },
}));

export default function IndexPage(Props) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const [posts, setPosts] = useState(Props.posts || []);
  const [userData, setUserData] = useState(Props.userData || null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Props.userData) {
      dispatch(updateUserData(userData));
      dispatch(updateIsUserLogged(true));
    }
  }, [userData]);

  const [openCreatePaletteDialog, setOpenCreatePaletteDialog] = React.useState(
    false
  );
  const handleClickOpenCreatePaletteDialog = () => {
    setOpenCreatePaletteDialog(true);
  };
  const handleCloseCreatePaletteDialog = () => {
    setOpenCreatePaletteDialog(false);
  };

  const [openShowPostDialog, setOpenShowPostDialog] = React.useState(true);
  const handleClickOpenShowPostDialog = () => {
    setOpenShowPostDialog(true);
  };
  const handleCloseShowPostDialog = () => {
    window.history.pushState("", "", "/");
    setOpenShowPostDialog(false);
  };

  const refreshPosts = async () => {
    let originUrl = process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
      ? process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
      : window.location.origin + "/api/";

    if (Cookies.get("palette-board-token")) {
      /* It's a registered user */
      const fetchPosts = await (
        await fetch(`${originUrl}posts`, {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${Cookies.get("palette-board-token")}`,
          }),
        })
      ).json();
      var posts = fetchPosts.data || [];

      const fetchUserData = await (
        await fetch(`${originUrl}verifyToken`, {
          method: "POST",
          headers: new Headers({
            Authorization: `Bearer ${Cookies.get("palette-board-token")}`,
          }),
        })
      ).json();
      var userData = fetchUserData.data || [];

      setUserData(userData);
      setPosts(posts);
    } else {
      /* Show public version of the site */
      const res = await (await fetch(`${originUrl}posts`)).json();
      var posts = res.data || [];

      setPosts(posts);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />

      {userData ? (
        <div>
          <Dialog
            open={openCreatePaletteDialog}
            onClose={handleCloseCreatePaletteDialog}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={"sm"}
            classes={{ paper: classes.dialogCard }}
          >
            <CreatePaletteDialog
              handleCloseDialog={handleCloseCreatePaletteDialog}
              onSumbitPost={refreshPosts}
            />
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}

      {Props.paletteData ? (
        <div>
          <Dialog
            open={openShowPostDialog}
            onClose={handleCloseShowPostDialog}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={"sm"}
            classes={{ paper: classes.dialogCard }}
          >
            <ShowPostDialog
              handleCloseDialog={handleCloseShowPostDialog}
              paletteData={Props.paletteData}
            />
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}

      <Navbar userData={userData} />
      <main>
        <Header />

        <Container className={classes.cardGrid} maxWidth="md">
          {userData ? (
            <Fab
              style={{ marginLeft: "0rem", marginBottom: "2rem" }}
              variant="extended"
              onClick={handleClickOpenCreatePaletteDialog}
              size="medium"
              color="primary"
              aria-label="add"
            >
              <AddIcon style={{ marginRight: "0.5rem" }} />
              Add Palette
            </Fab>
          ) : (
            <div></div>
          )}

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
