"use client";
import React, { useEffect, useRef, useState } from "react";
import inputControlsData from "./Include/inputControls";
import Input from "./Component/Input";
import RegisterValidations from "./Validations/RegisterValidations";
import { toast } from "react-toastify";
import { Loader } from "./Component/Loader";
import { Table } from "./Component/Table";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://schooldata-server.onrender.com";

export default function Register() {
  const [inputControls, setInputControls] = useState(inputControlsData);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const fileRef = useRef(null);

  // ==============================
  // Fetch Students
  // ==============================
  const fnGetStudent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/std/get-std`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Ensure always array
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch students");
      setStudents([]);
    }
  };

  useEffect(() => {
    fnGetStudent();
  }, []);

  // ==============================
  // Handle Input Change
  // ==============================
  const fnchange = (eve) => {
    const { name, value } = eve.target;

    const newInputControls = structuredClone(inputControls);
    const inputObj = newInputControls.find((obj) => obj.name === name);

    if (!inputObj) return;

    inputObj.val = value;
    inputObj.error = RegisterValidations(name, value);

    setInputControls(newInputControls);
  };

  // ==============================
  // Register Student
  // ==============================
  const fnRegister = async () => {
    let isValid = true;

    const newInputControls = structuredClone(inputControls);

    // Validation
    newInputControls.forEach((obj) => {
      const errorMsg = RegisterValidations(obj.name, obj.val);
      obj.error = errorMsg || "";
      if (errorMsg || !obj.val) isValid = false;
    });

    setInputControls(newInputControls);

    if (!isValid) {
      toast.error("Please enter all details correctly");
      return;
    }

    // Create Payload
    const payload = {};
    newInputControls.forEach((obj) => {
      payload[obj.name] = obj.val;
    });

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/std/save-std`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.acknowledged && data.insertedId) {
        toast.success("Registered Successfully");

        // Refresh table
        await fnGetStudent();

        // Clear form
        const clearedInputControls = newInputControls.map((obj) => ({
          ...obj,
          val: "",
          error: "",
        }));

        setInputControls(clearedInputControls);

        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error("Error saving student");
      }
    } catch (err) {
      console.error("Register error:", err);
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

      {/* Students Table */}
      <Table
        headers={["UserID", "Password", "Gender", "Hobbies", "Country"]}
        imgheaders={["Photo"]}
        data={Array.isArray(students) ? students : []}
        columns={["userId", "password", "gender", "hobbies", "country"]}
        imgcolumn={["photo"]}
      />

      {loading && <Loader />}
    </div>
  );
}