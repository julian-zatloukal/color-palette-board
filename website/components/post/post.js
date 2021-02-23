import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import { useTheme } from "@material-ui/core/styles";
import moment from "moment";
import Cookies from "js-cookie";

import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../utils/userDataSlice";
import {
  openAlert,
  closeAlert,
  updateAlertMessage,
  updateAlertSeverity,
  sendAlert
} from "../utils/globalAlertSlice";

import DotMenu from "./dotMenu";
import Palette from "./Palette";
import PostAction from "./PostActions";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  loveButton: {
    paddingLeft: "6px",
  },
}));

export default function RecipeReviewCard({ data }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const [expanded, setExpanded] = React.useState(false);
  const [likeCount, setLikeCount] = useState(data.likesInfo.count);
  const [isLiked, setIsLiked] = useState(data.userLiked);
  const isUserLogged = useSelector((state) => state.userData.isUserLogged);
  const dispatch = useDispatch();

  useEffect(() => {
    setLikeCount(data.likesInfo.count);
    setIsLiked(data.userLiked);
  }, [data]);

  const handleLike = async () => {
    if (isUserLogged) {
      if (!isLiked) {
        // Like the post
        const res = await (
          await fetch(
            `${process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT}posts/like`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Cookies.get("palette-board-token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                shortUUID: data.shortUUID,
                action: "like",
              }),
            }
          )
        ).json();

        setLikeCount(likeCount + 1);
        setIsLiked(true);
      } else {
        // Dislike the post
        const res = await (
          await fetch(
            `${process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT}posts/like`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Cookies.get("palette-board-token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                shortUUID: data.shortUUID,
                action: "dislike",
              }),
            }
          )
        ).json();

        setLikeCount(likeCount - 1);
        setIsLiked(false);
      }
    } else {
      dispatch(sendAlert({
        severity: 'error',
        message: 'Please login in order to like a post.'
      }));
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          data.author.profilePicture !== "" ? (
            <Avatar aria-label="recipe" className={classes.avatar}>
              {data.author.username[0]}
            </Avatar>
          ) : (
            <Avatar src={data.author.profilePicture} />
          )
        }
        action={<DotMenu />}
        title={data.author.username}
        subheader={moment.utc(data.createdAt).fromNow()}
      />

      <Palette colors={data.palette} />

      <PostAction
        likeCount={likeCount}
        isLiked={isLiked}
        isUserLogged={isUserLogged}
        handleLike={handleLike}
      />
    </Card>
  );
}
