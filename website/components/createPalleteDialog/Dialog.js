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
import { TwitterPicker } from "react-color";
import colorBarStyles from "./ColorBar.module.css";
import dialogStyles from "./Dialog.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  updateColorBar,
  addColorBar,
  removeColorBar,
  updateSelectedBarId,
  updateIsOnChange,
  updateAllColorBars,
} from "./paletteDialogSlice";

import ColorPicker from "./ColorPicker";
import SumbitButton from "./SubmitButton";

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
  padding: 0,
  paddingBottom: 8,
  height: "12rem",
  overflow: "auto",
});

export default function CreatePaletteDialog({
  handleCloseDialog,
  onSumbitPost,
}) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  const [items, setItems] = useState([]);

  const dispatch = useDispatch();
  const palette = useSelector((state) => state.paletteDialog.palette);
  const selectedBarId = useSelector(
    (state) => state.paletteDialog.selectedBarId
  );

  const getItemStyle = (isDragging, draggableStyle, color, id) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 0 0`,
    background: color,
    ...draggableStyle,
  });

  useEffect(() => {
    setItems(palette);
  }, [palette]);

  useEffect(() => {
    let newPalette = Array(5)
      .fill()
      .reduce((acc, v, i) => acc.concat(randomRgbColor()), []);

    dispatch(updateAllColorBars(newPalette));
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
    dispatch(updateAllColorBars(orderedItems));
  };

  const onSelectBar = (itemId) => {
    if (selectedBarId === itemId) {
      dispatch(updateSelectedBarId(-1));
    } else {
      dispatch(updateSelectedBarId(itemId));
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
                        ></div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        <Box
          component="div"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          {/* <Box alignSelf="flex-start" className={dialogStyles.colorSelector} >
            <TwitterPicker
              triangle="hide"
              colors={Array(12)
                .fill()
                .reduce((acc, v, i) => acc.concat(randomRgbColor()), [])}
            />
          </Box> */}
          <Box component="div" style={{ width: "100%" }}>
            <ColorPicker />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
        <SumbitButton
          callback={() => {
            handleCloseDialog();
            onSumbitPost();
          }}
        />
      </DialogActions>
    </React.Fragment>
  );
}
