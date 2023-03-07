import { Cancel, Check, Edit } from "@mui/icons-material";
import { IconButton, Input, InputAdornment, Tooltip } from "@mui/material";
import { useState } from "react";

export default function EditableValue({value: initialValue = '', isValid = () => true, onSave}: any) {
  const [value, setValue] = useState(initialValue);
  const [edit, setEdit] = useState(false);

  function handleCancel() {
    setEdit(false);
    setValue(initialValue);
  }

  function handleSave() {
    setEdit(false);
    onSave(value);
  }

  const valid = isValid(value);

  return (
    <>
      {edit ? (
        <>
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleCancel}>
                  <Tooltip title="Cancel">
                    <Cancel />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={handleSave} disabled={!valid}>
                  <Tooltip title="Save">
                    <Check />
                  </Tooltip>
                </IconButton>
              </InputAdornment>
            } />
        </>
      ) : (
        <span>
          {value}
          <IconButton onClick={() => setEdit(true)}>
            <Tooltip title="Edit">
              <Edit />
            </Tooltip>
          </IconButton>
        </span>
      )}
    </>
  );
}
