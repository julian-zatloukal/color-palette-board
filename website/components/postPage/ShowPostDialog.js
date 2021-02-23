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
import {
  updateColorBar,
  addColorBar,
  removeColorBar,
  updateSelectedBarId,
  updateIsOnChange,
  updateAllColorBars,
} from "../createPalleteDialog/paletteDialogSlice";

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
  const palette = useSelector((state) => state.paletteDialog.palette);
  const selectedBarId = useSelector(
    (state) => state.paletteDialog.selectedBarId
  );

  const [items, setItems] = useState([]);

  useEffect(() => {
    paletteData.palette.forEach((v, i) =>
      dispatch(
        addColorBar({
          id: `bar-${i}`,
          color: v,
        })
      )
    );
  }, []);

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

  useEffect(() => {
    setItems(palette);
  }, [palette]);

  //   useEffect(() => {
  //     if (palette.length === 0) {
  //       Array(5)
  //         .fill()
  //         .forEach((v, i) =>
  //           dispatch(
  //             addColorBar({
  //               id: `bar-${i}`,
  //               color: randomRgbColor(),
  //             })
  //           )
  //         );
  //     } else {
  //       Array(palette.length)
  //         .fill()
  //         .forEach((v, i) =>
  //           dispatch(updateColorBar({ id: `bar-${i}`, color: randomRgbColor() }))
  //         );
  //     }
  //   }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const orderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(orderedItems);
    dispatch(updateAllColorBars(orderedItems));
  };

  const onSelectBar = (itemId) => {
    if (selectedBarId === itemId) {
      dispatch(updateSelectedBarId(-1));
    } else {
      dispatch(updateSelectedBarId(itemId));
      dispatch(updateIsOnChange(true));
    }
  };

  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">Create new color palette</DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }}>
        <DialogContentText>
          Add, change, and remove colors from the compositon. Drag and drop to
          change the order of the colors.
        </DialogContentText>
        <Box component="div">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {items.map((item, index) => (
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
        <Button onClick={handleCloseDialog} color="primary">
          OK
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
