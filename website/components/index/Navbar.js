import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import PaletteIcon from "@material-ui/icons/Palette";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: "1rem",
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar({ userData }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const router = useRouter();

  const logout = () => {
    Cookies.remove('palette-board-token');
    router.reload();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <PaletteIcon className={classes.icon} />
          <Typography variant="h6" className={classes.title}>
            Palette Board
          </Typography>

          {userData ? (
            <Box component="div" display="flex" flexDirection="row">
              <Box mr={3} component="div" display="flex" alignItems="center">
                <Typography variant="body1" component="div">
                  {`Hello, ${userData.username}`}
                </Typography>
              </Box>

              <Button
                color="inherit"
                onClick={() => logout()}
                startIcon={<ExitToAppIcon />}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
