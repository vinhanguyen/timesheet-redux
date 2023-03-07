import { Box } from "@mui/material";

export default function Help() {
  return (
    <Box p={2}>
      <p>Usage:</p>
      <ol>
        <li>Add jobs</li>
        <li>Select current job</li>
        <li>Click start to start work</li>
        <li>Click stop to stop work</li>
      </ol>
    </Box>
  );
}
