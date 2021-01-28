import React from "react";
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

export default function RecipeReviewCard() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={<DotMenu />}
        title="Zenkko"
        subheader="September 14, 2016"
      />

      <Palette colors={["#292F36", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"]} />

      <CardActions disableSpacing>
        <FormControlLabel
          control={
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
            />
          }
          label="435"
          className={classes.loveButton}
        />

        <ShareMenu />
      </CardActions>
    </Card>
  );
}
