import React, { useRef, useState } from "react";
import OrganizationChart from "@dabeng/react-orgchart";
import { Button, Typography } from "antd";
import MyNode from "./node";
import "./style.scss";

const { Title } = Typography;

const ds = {
  id: "n1",
  name: "Lao Lao",
  title: "general manager",
  children: [
    {
      id: "n2",
      name: "Bo Miao",
      title: "department manager",
      dob: "01-03-2020",
      gender: "Male",
      is_nok: false,
      emrgency_contact: false,
      city: "Gurgaon",
      phoneNo: "+9198XXXXXXXX",
    },
    {
      id: "n3",
      name: "Su Miao",
      title: "department manager",
      children: [
        { id: "n4", name: "Tie Hua", title: "senior engineer" },
        {
          id: "n5",
          name: "Hei Hei",
          title: "senior engineer",
          dob: "01-03-2020",
          gender: "Male",
          is_nok: true,
          emrgency_contact: false,
          city: "Gurgaon",
          phoneNo: "+9198XXXXXXXX",
          children: [
            {
              id: "n6",
              name: "Dan Dan",
              title: "engineer",
              dob: "01-03-2020",
              gender: "Male",
              is_nok: false,
              emrgency_contact: false,
              city: "Gurgaon",
              phoneNo: "+9198XXXXXXXX",
            },
            {
              id: "n7",
              name: "Xiang Xiang",
              title: "engineer",
              dob: "01-03-2020",
              gender: "FeMale",
              is_nok: false,
              emrgency_contact: false,
              city: "Gurgaon",
              phoneNo: "+9198XXXXXXXX",
            },
          ],
        },
        {
          id: "n8",
          name: "Pang Pang",
          title: "senior engineer",
          dob: "01-03-2020",
          gender: "Male",
          is_nok: false,
          emrgency_contact: true,
          city: "Gurgaon",
          phoneNo: "+9198XXXXXXXX",
        },
      ],
    },
    {
      id: "n9",
      name: "Hong Miao",
      title: "department manager",
      dob: "01-03-2020",
      gender: "Male",
      is_nok: false,
      emrgency_contact: false,
      city: "Gurgaon",
      phoneNo: "+9198XXXXXXXX",
    },
    {
      id: "n10",
      name: "Chun Miao",
      title: "department manager",
      dob: "01-03-2020",
      gender: "Male",
      is_nok: false,
      emrgency_contact: false,
      city: "Gurgaon",
      phoneNo: "+9198XXXXXXXX",
      children: [
        {
          id: "n11",
          name: "Yue Yue",
          title: "senior engineer",
          dob: "01-03-2020",
          gender: "Male",
          is_nok: false,
          emrgency_contact: false,
          city: "Gurgaon",
          phoneNo: "+9198XXXXXXXX",
        },
      ],
    },
  ],
};

function FamilyDetails() {
  const orgchart = useRef();

  const exportTo = () => {
    orgchart.current.exportTo(filename, fileextension);
  };

  const [filename, setFilename] = useState("organization_chart");
  const [fileextension, setFileextension] = useState("png");

  const onNameChange = (event) => {
    setFilename(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileextension(event.target.value);
  };
  return (
    <div>
      <Title level={4}>Family Details</Title>
      <section className="toolbar">
        <label htmlFor="txt-filename">Filename:</label>
        <input
          id="txt-filename"
          type="text"
          value={filename}
          onChange={onNameChange}
          style={{ fontSize: "1rem", marginRight: "2rem" }}
        />
        <span>Fileextension: </span>
        <input
          id="rd-png"
          type="radio"
          value="png"
          checked={fileextension === "png"}
          onChange={onExtensionChange}
        />
        <label htmlFor="rd-png">png</label>
        <input
          style={{ marginLeft: "1rem" }}
          id="rd-pdf"
          type="radio"
          value="pdf"
          checked={fileextension === "pdf"}
          onChange={onExtensionChange}
        />
        <label htmlFor="rd-pdf">pdf</label>
        <Button type="dashed" onClick={exportTo} style={{ marginLeft: "2rem" }}>
          Export
        </Button>
      </section>

      <OrganizationChart datasource={ds} NodeTemplate={MyNode} ref={orgchart} />
    </div>
  );
}

export default FamilyDetails;
