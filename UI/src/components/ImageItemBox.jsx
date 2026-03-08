import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
const ImageBox = styled(Box)({
  overflow: "visible",
});
export default function ImageItemBox({ props, option }) {
  const { key, ...optionProps } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <ImageBox
      key={key}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      component="li"
      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
      {...optionProps}
    >
      <img
        loading="lazy"
        width="20"
        onError={(e) => e.target.src = "/poster404.png"}
        src={option.Poster}
        alt={"Image of " + option.Title}
      />
      <Popover
        style={{ width: 200 }}
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disableRestoreFocus
      >
        <img
          loading="lazy"
          width="150"
          onError={(e) => e.target.src = "/poster404.png"}
          src={option.Poster}
          alt={"Image of " + option.Title}
        />
      </Popover>
      {option.Title}
    </ImageBox>
  );
}
