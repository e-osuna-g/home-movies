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
        onInputChange(event, newInputValue);
        //onValueChange(event, newInputValue);
      }}
      value={value} // TODO: update this part value=null is super strange even tho value is not needed more modal
      inputValue={inputValue}
      onChange={(event, newValue) => {
        onChange(event, newValue);
        //onInputChange(event, newValue);
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
