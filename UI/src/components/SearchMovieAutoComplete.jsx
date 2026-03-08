import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ImageItemBox from "./ImageItemBox.jsx";
import { useState } from "react";

export default function SearchMovieAutoComplete({
  options,
  value,
  onChange,
  inputValue,
  onInputChange,
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Autocomplete
      freeSolo
      onInputChange={(event, newInputValue) => {
        if (!isOpen) setIsOpen(true);
        if (event.code == "Enter") return;
        onInputChange(event, newInputValue);
      }}
      getOptionLabel={(opt) => opt.Title}
      getOptionKey={(opt) => opt.imdbID}
      renderOption={(props, option) => {
        const { key } = props;
        return <ImageItemBox key={key} props={props} option={option} />;
      }}
      value={value}
      inputValue={inputValue}
      open={isOpen}
      disableCloseOnSelect={true}
      onChange={(event, newValue) => {
        setIsOpen(false);
        onChange(event, newValue);
      }}
      options={options}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Search movie"
          />
        );
      }}
    />
  );
}
