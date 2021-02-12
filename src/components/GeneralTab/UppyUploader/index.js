import React, { useState, useEffect } from "react";
import { Card, Tooltip, Button } from "antd";
import { get } from "lodash";
import { faUpload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DashboardModal from "@uppy/react/lib/DashboardModal";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

import './style.scss';

const Uppy = require("@uppy/core");
const Dashboard = require("@uppy/dashboard");
// const GoogleDrive = require("@uppy/google-drive");
// const Dropbox = require("@uppy/dropbox");
// const Instagram = require("@uppy/instagram");
// const Facebook = require("@uppy/facebook");
// const OneDrive = require("@uppy/onedrive");
const Webcam = require("@uppy/webcam");
const ScreenCapture = require("@uppy/screen-capture");
const ImageEditor = require("@uppy/image-editor");
// const Url = require("@uppy/url");

const { Meta } = Card;

function Upload({ loading, elderData }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false)
  }, []);

  const uppy = Uppy({
    debug: true,
    autoProceed: false,
    restrictions: {
      maxFileSize: 1000000,
      maxNumberOfFiles: 1,
      minNumberOfFiles: 1,
      allowedFileTypes: ["image/*"],
    },
  })
    .use(Dashboard, {
      inline: true,
      showProgressDetails: true,
      note: "Images and video only, 2–3 files, up to 1 MB",
      height: 200,
      maxHeight: 200,
      metaFields: [
        { id: "name", name: "Name", placeholder: "file name" },
        {
          id: "caption",
          name: "Caption",
          placeholder: "describe what the image is about",
        },
      ],
      browserBackButtonClose: true,
    })
    .use(Webcam, { target: Dashboard })
    .use(ScreenCapture, { target: Dashboard })
    .use(ImageEditor, { target: Dashboard });

  uppy.on("complete", (result) => {
    console.log("successful files:", result.successful);
    console.log("failed files:", result.failed);
  });

  useEffect(() => {
    if(!show){
      uppy.close();
    }
  });

  function handleOpen() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  return (
    <Card
      loading={loading}
      hoverable
      style={{ width: 240, marginTop: 40 }}
      cover={<img alt="example" src={get(elderData, "image_url")} />}
      actions={[
        <Tooltip title="Upload Elder`s Profile Picture">
          <Button onClick={() => handleOpen()}>
            <FontAwesomeIcon icon={faUpload} />
          </Button>
        </Tooltip>,
        <Tooltip title="Edit Elder`s Profile Picture">
          <Button onClick={() => handleOpen()}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        </Tooltip>,
        <Tooltip title="Delete Elder`s Profile Picture">
          <Button>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Tooltip>,
      ]}
    >
      <Meta
        title="Profile Picture"
        description="We can upload, edit and remove elder`s profile picture"
      />
      {show ?
      <DashboardModal
        uppy={uppy}
        open={show}
        trigger="#uppy-upload"
        target="#uppy-upload"
        onRequestClose={() => handleClose()}
        proudlyDisplayPoweredByUppy={false}
        allowMultipleUploads={false}
        closeAfterFinish
        height={400}
        maxHeight={400}
      />: <div />}
      <div id="uppy-upload" />
    </Card>
  );
}

export default Upload;
