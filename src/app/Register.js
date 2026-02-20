"use client";
import React, { useEffect, useRef, useState } from "react";
import inputControlsData from "./Include/inputControls";
import Input from "./Component/Input";
import RegisterValidations from "./Validations/RegisterValidations";
import { toast } from "react-toastify";
import { Loader } from "./Component/Loader";
import { Table } from "./Component/Table";
import "react-toastify/dist/ReactToastify.css";

// Change this to your Render backend URL
const API_BASE_URL = "https://schooldata-server.onrender.com";

export default function Register() {
  const [inputControls, setInputControls] = useState(inputControlsData);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const fileRef = useRef(null);

  // Fetch students from backend
  const fnGetStudent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/std/get-std`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setStudents([]);
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fnGetStudent();
  }, []);

  // Handle input change
  const fnchange = (eve) => {
    const { name, value } = eve.target;
    const newInputControls = structuredClone(inputControls);
    const inputObj = newInputControls.find((obj) => obj.name === name);
    if (!inputObj) return;
    inputObj.val = value;
    inputObj.error = RegisterValidations(name, value);
    setInputControls(newInputControls);
  };

  // Register new student
  const fnRegister = async () => {
    let isValid = true;
    const newInputControls = structuredClone(inputControls);

    newInputControls.forEach((obj) => {
      const errormsg = RegisterValidations(obj.name, obj.val);
      obj.error = errormsg || "";
      if (errormsg || !obj.val) isValid = false;
    });

    setInputControls(newInputControls);
    if (!isValid) {
      alert("Enter Detail");
      return;
    }

    // Prepare FormData for possible file upload
    const formData = new FormData();
    newInputControls.forEach((obj) => {
      formData.append(obj.name, obj.val);
    });

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/std/save-std`, {
        method: "POST",
        body: formData, // sending FormData handles files automatically
      });

      const data = await res.json();

      if (data.acknowledged && data.insertedId) {
        toast.success("Registered Successfully");
        fnGetStudent();

        // Clear form
        const clearedInputControls = inputControls.map((obj) => ({
          ...obj,
          val: "",
          error: "",
        }));
        setInputControls(clearedInputControls);

        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error("Error saving user");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-center mx-3">Register</h3>

      <div className="container-fluid">
        {inputControls.map((control, index) => (
          <Input
            key={index}
            label={control.label}
            name={control.name}
            type={control.type}
            placeholder={control.placeholder}
            options={control.options}
            val={control.val}
            error={control.error}
            fnchange={fnchange}
            fileRef={control.type === "file" ? fileRef : null}
          />
        ))}

        <div className="text-center mt-3">
          <button onClick={fnRegister} className="btn btn-primary">
            Register
          </button>
        </div>
      </div>

      {/* Table rendering */}
      <Table
        headers={["UserID", "Password", "Gender", "Hobbies", "Country"]}
        imgheaders={["Photo"]}
        data={students}
        columns={["userId", "password", "gender", "hobbies", "country"]}
        imgcolumn={["photo"]}
      />

      {loading && <Loader />}
    </div>
  );
}