import { useState } from "react";

export default function EditableValue({value: initialValue = '', isValid = () => true, onSave}: any) {
  const [value, setValue] = useState<string>(initialValue);
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
          <input value={value} onChange={e => setValue(e.target.value)} />
          {' '}
          <button onClick={handleCancel}>Cancel</button>
          {' '}
          <button onClick={handleSave} disabled={!valid}>Save</button>
        </>
      ) : (
        <span>
          {value}
          {' '}
          <button onClick={() => setEdit(true)}>Edit</button>
        </span>
      )}
    </>
  );
}
