import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import Favorite from "@material-ui/icons/Favorite";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import { useTheme } from "@material-ui/core/styles";
import moment from "moment";
import Cookies from 'js-cookie';

import DotMenu from "./dotMenu";
import ShareMenu from "./ShareMenu";
import Palette from "./Palette";

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
  const [liked, setLiked] = useState(data.userLiked);

  const handleLike = async () => {
    if (!liked){
      // Like the post
      const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT}posts/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('palette-board-token')}`, 
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          shortUUID: data.shortUUID,
          action: 'like'
        })
      })).json();

      setLikeCount(likeCount+1);
      setLiked(true);

      console.log(res);

    } else {
      // Dislike the post
      const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT}posts/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('palette-board-token')}`, 
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          shortUUID: data.shortUUID,
          action: 'dislike'
        })
      })).json();


      setLikeCount(likeCount-1);
      setLiked(false);

      console.log(res);
    }

  }


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          data.author.profilePicture!=="" ? (
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

      <CardActions disableSpacing>
        <FormControlLabel
          control={
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
              checked={liked}
            />
          }
          onClick={()=> handleLike()}
          label={likeCount}
          className={classes.loveButton}
        />

        <ShareMenu />
      </CardActions>
    </Card>
  );
}
