import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Convert from "color-convert";
import colorBarStyles from "./ColorBar.module.css";

import { useSelector, useDispatch } from "react-redux";


const useStyles = makeStyles((theme) => ({
  dialogContent: {
    overflowY: "unset",
  },
  input: {
    width: 42,
  },
}));

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
    color: randomRgbColor(),
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getListStyle = (isDraggingOver) => ({
  background: "white",
  display: "flex",
  padding: grid,
  height: "12rem",
  overflow: "auto",
});

export default function ShowPostDialog({ handleCloseDialog, paletteData }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  const dispatch = useDispatch();

  const [palette, setPalette] = useState(paletteData.palette.reduce(
    (acc, v, i) => acc.concat({ color: v, id: `bar-${i}` }),
    []
  ));
  const [selectedBarId, setSelectedBarId] = useState(null);
  const [currentColor, setCurrentColor] = useState("#000000");



  const getItemStyle = (isDragging, draggableStyle, color, id) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 0 0`,

    // change background colour if dragging
    background: color,

    // styles we need to apply on draggables
    ...draggableStyle,
  });


  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const orderedItems = reorder(
      palette,
      result.source.index,
      result.destination.index
    );
    setPalette(orderedItems);
  };

  const onSelectBar = (itemId) => {
    if (selectedBarId === itemId) {
      setSelectedBarId(null);
    } else {
      setSelectedBarId(itemId);
      let index = palette.findIndex((item) => item.id === itemId);
      setCurrentColor(palette[index].color);
    }
  };

  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">
        <Box
          component="div"
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
        >
          Post by {paletteData.author.username}{" "}
          <Typography
            style={{ marginLeft: "0rem" }}
            variant="caption"
            gutterBottom
          >
            ID: {paletteData.shortUUID}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }}>
        {/* <DialogContentText>
          fdsdf
        </DialogContentText> */}
        <Box component="div">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {palette.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          onClick={() => onSelectBar(item.id)}
                          className={
                            item.id === selectedBarId
                              ? colorBarStyles.selectedColorBar
                              : colorBarStyles.colorBar
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            item.color,
                            item.id
                          )}
                        >
                          {/* {item.content} */}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleCloseDialog();
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
