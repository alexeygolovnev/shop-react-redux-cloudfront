import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { Buffer } from "buffer";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    if (file) {
      let token = localStorage.getItem("authToken");
      if (!token) {
        token = Buffer.from("alexeygolovnev:TEST_PASSWORD", "utf8").toString(
          "base64"
        );
        localStorage.setItem("authToken", token);
      }

      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      const result = await axios.put(response.data.url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      console.log("Result: ", result);
      setFile(null);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
