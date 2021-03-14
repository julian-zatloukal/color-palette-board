import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  hideButton: {
    marginRight: "1rem",
  },
}));


const StyledMenu = withStyles({

  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...props}
    />
  ));



export default function DotMenu() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deletePost = () => {
    
  }

  return (
    <div>
      <IconButton
        aria-label="settings"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
            
          <DeleteIcon fontSize="small" className={classes.hideButton}  onClick={deletePost} /> Delete
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
