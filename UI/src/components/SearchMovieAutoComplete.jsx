import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function SearchMovieAutoComplete({
  options,
  value,
  onChange,
  inputValue,
  onInputChange,
}) {
  return (
    <Autocomplete
      freeSolo
      onInputChange={(event, newInputValue) => {
        if (event.code == "Enter") return;
        onInputChange(event, newInputValue);
      }}
      value={value}
      inputValue={inputValue}
      disableCloseOnSelect={true}
      onChange={(event, newValue) => {
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
