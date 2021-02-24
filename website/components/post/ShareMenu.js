import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import LinkIcon from "@material-ui/icons/Link";
import ShareIcon from "@material-ui/icons/Share";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import * as clipboard from "clipboard-polyfill/text";

import { useDispatch, useSelector } from "react-redux";
import {
  openAlert,
  updateAlertMessage,
  sendAlert,
} from "../utils/globalAlertSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  hideButton: {
    marginRight: "1rem",
  },
}));

const StyledMenu = withStyles({})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

export default function ShareMenu({ postId }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyPostUrl = () => {
    clipboard.writeText(`${window.location.origin}/${postId}`).then(()=>{
      dispatch(
        sendAlert({
          severity: "info",
          message: "URL copied to clipboard.",
        })
      );
    }).catch((err)=>{
      dispatch(
        sendAlert({
          severity: "error",
          message: "Error while copying to clipboard.",
        })
      );
    });

   
  };

  return (
    <div>
      <IconButton
        aria-label="share"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <ShareIcon />
      </IconButton>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            copyPostUrl();
            handleClose();
          }}
        >
          <LinkIcon fontSize="small" className={classes.hideButton} /> Copy URL
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
