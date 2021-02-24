import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { red, grey, pink } from "@material-ui/core/colors";
import { useTheme } from "@material-ui/core/styles";

import ShareMenu from "./ShareMenu";

const useStyles = makeStyles((theme) => ({
  loveButton: {
    paddingLeft: "6px",
  },
}));

const CustomCheckbox = withStyles({
  root: {
    color: grey[600],
    "&$checked": {
      color: pink["A400"],
    },
    "&$disabled": {
      color: grey[600],
    },
  },
  checked: {},
  disabled: {},
})(Checkbox);

export default function PostActions({
  isUserLogged,
  isLiked,
  likeCount,
  handleLike,
  postData
}) {
  const themeContext = useTheme();
  const classes = useStyles(themeContext);

  return (
    <CardActions disableSpacing>
      <Box component="div" display="flex" alignItems="center">
        <FormControlLabel
          control={
            <CustomCheckbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
              disabled={!isUserLogged}
              checked={isLiked}
            />
          }
          onClick={() => handleLike()}
          className={classes.loveButton}
          style={{ marginRight: "0.15rem" }}
        />

        <Typography
          variant="body1"
          gutterBottom
          style={{ marginBottom: "0", marginRight: "1rem" }}
        >
          {likeCount}
        </Typography>
      </Box>

      <ShareMenu postId={postData.shortUUID} />
    </CardActions>
  );
}
