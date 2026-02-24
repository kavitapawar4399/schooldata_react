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
  const [editId, setEditId] = useState(null);
  const fileRef = useRef(null);

  // ==============================
  // Fetch Students
  // ==============================
  const fnGetStudent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/std/get-std`);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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
  // DELETE Student
  // ==============================
  const fnDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/std/delete-std/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Deleted Successfully");
      fnGetStudent();
    } catch (err) {
      toast.error("Delete error");
    }
  };

  // ==============================
  // EDIT Student
  // ==============================
  const fnEdit = (student) => {
    const newInputControls = structuredClone(inputControls);

    newInputControls.forEach((control) => {
      control.val = student[control.name] || "";
    });

    setInputControls(newInputControls);
    setEditId(student._id);
  };

  // ==============================
  // REGISTER / UPDATE
  // ==============================
  const fnRegister = async () => {
    let isValid = true;
    const newInputControls = structuredClone(inputControls);

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

    const payload = {};
    newInputControls.forEach((obj) => {
      payload[obj.name] = obj.val;
    });

    try {
      setLoading(true);

      let res;

      if (editId) {
        // UPDATE
        res = await fetch(`${API_BASE_URL}/std/update-std/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch(`${API_BASE_URL}/std/save-std`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Operation failed");

      toast.success(editId ? "Updated Successfully" : "Registered Successfully");

      setEditId(null);
      fnGetStudent();

      // Clear form
      const clearedInputControls = newInputControls.map((obj) => ({
        ...obj,
        val: "",
        error: "",
      }));

      setInputControls(clearedInputControls);

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-center mx-3">
        {editId ? "Update Student" : "Register"}
      </h3>

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
            {editId ? "Update" : "Register"}
          </button>
        </div>
      </div>

      <Table
        headers={["UserID", "Password", "Gender", "Hobbies", "Country"]}
        imgheaders={["Photo"]}
        data={students}
        columns={["userId", "password", "gender", "hobbies", "country"]}
        imgcolumn={["photo"]}
        onEdit={fnEdit}
        onDelete={fnDelete}
      />

      {loading && <Loader />}
    </div>
  );
}