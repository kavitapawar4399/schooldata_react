"use client"; 
import React, { useEffect } from 'react'; 
import inputControlsData from './Include/inputControls';
 import Input from './Component/Input'; 
 import RegisterValidations from './Validations/RegisterValidations'; import { toast } from 'react-toastify'; 
import { Loader } from './Component/Loader';

 import { Table } from './Component/Table';
 import 'react-toastify/dist/ReactToastify.css';


 export default function Register() {
   
  const [inputControls, setInputControls] = React.useState(inputControlsData);
    const fileRef = React.useRef(null);
 const [loading, setLoading] = React.useState(false);
 const [students, setStudents] = React.useState([]);

 const fnGetStudent = async () => {
  try {
    const res = await fetch("http://localhost:5000/std/get-std");
    const data = await res.json();
    setStudents(data);
  } catch (err) {
    console.log(err);
  }
};
 useEffect(() => {
  fnGetStudent();
 }, []);
    
  const fnRegister = async () => {
  let isValid = true;
  const newinputControls = structuredClone(inputControls);

  newinputControls.forEach((obj) => {
    const errormsg = RegisterValidations(obj.name, obj.val);
    obj.error = errormsg || '';

    if (errormsg || !obj.val) {
      isValid = false;
    }
  });

  setInputControls(newinputControls);

  if (!isValid) {
    alert("Enter Detail");
    return;
  }

  // prepare user object
  const userData = {};
  newinputControls.forEach(obj => {
    userData[obj.name] = obj.val;
  });

  try {
    setLoading(true);
    const res = await fetch("http://localhost:5000/std/save-std", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    // MongoDB returns acknowledged + insertedId
    if (data.acknowledged && data.insertedId) {
      toast.success("Registered Successfully");
       fnGetStudent();
      // Clear form
      const clearedInputControls = inputControls.map(obj => ({ ...obj, val: '', error: '' }));
      setInputControls(clearedInputControls);
      
      if (fileRef.current) {
    fileRef.current.value = "";
  }
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
const fnchange = (eve) => { const { name, value } = eve.target;
 const newinputControls = structuredClone(inputControls); 
 const inputobj = newinputControls.find(obj => obj.name === name); if (!inputobj) return; inputobj.val = value; const errormsg = RegisterValidations(name, value); inputobj.error = errormsg; setInputControls(newinputControls); 
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

    <Table
       headers={["UserID", "Password", "Gender", "Hobbies","Country"]}
  imgheaders={["Photo"]}
  data={students}
  columns={["userId", "password", "gender", "hobbies", "country"]}
  imgcolumn={["photo"]}
    />

    {loading && <Loader />}
  </div>
);
 }