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

import { useSelector, useDispatch } from "react-redux";
import {
  updateColorBar,
  addColorBar,
  removeColorBar,
} from "./paletteDialogSlice";

import ColorPicker from "./ColorPicker";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    overflowY: "unset",
  },
  input: {
    width: 42,
  },
}));

const randomRgbColor = () => {
  let rgb = Convert.hsl.hex(
    Math.floor(Math.random() * Math.floor(360)),
    60,
    60
  );

  return `#${rgb}`;
};

// fake data generator
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
    color: randomRgbColor(),
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, color) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 0 0`,
  flexGrow: 1,

  // change background colour if dragging
  background: color,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: "white",
  display: "flex",
  padding: grid,
  height: "12rem",
  overflow: "auto",
});

export default function CreatePaletteDialog({ handleCloseDialog }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  const [items, setItems] = useState(getItems(5));

  // const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  const palette = useSelector(state => state.paletteDialog.palette);

  useEffect(() => {


  }, []);

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
  };

  const [selectedColor, setSelectedColor] = useState(randomRgbColor());
  const [selectedId, setSelectedId] = useState("item-0");

  const updateColor = (color) => {
    let rgb = `#${Convert.hsl.hex(
      color.hue,
      color.saturation,
      color.lightness
    )}`;
    let newItems = Array.from(items);
    let index = newItems.findIndex((item) => item.id === selectedId);
    newItems[index].color = rgb;
    setItems(newItems);
  };

  const onSelectBar = (itemId) => {
    let index = items.findIndex((item) => item.id === itemId);
    setSelectedId(itemId);
    setSelectedColor(items[index].color);
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
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            item.color
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

        <ColorPicker
          initialColor={selectedColor}
          updateColor={(color) => updateColor(color)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCloseDialog} color="primary">
          Sumbit
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
