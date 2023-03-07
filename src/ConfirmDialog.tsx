import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function ConfirmDialog({
  open = false, 
  title = 'Confirm', 
  message = 'Confirm?', 
  onCancel = () => {}, 
  onConfirm = () => {},
  onClose = () => {}
}: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
