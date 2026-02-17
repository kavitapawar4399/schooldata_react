

export default function RegisterValidations (name, value) {
    let errormsg='';
  if (name === 'userId') {
  if (!value) {
    errormsg = 'userId is required';
  } else {
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regExp.test(value)) {
      errormsg = 'userId must be a valid email address';
    }
  }
}



  if (name === 'password') {
  if (!value) {
    errormsg = 'Password is required';
  } else if (value.length < 8) {
    errormsg = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(value)) {
    errormsg = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(value)) {
    errormsg = 'Password must contain at least one lowercase letter';
  } else if (!/[0-9]/.test(value)) {
    errormsg = 'Password must contain at least one number';
  } else if (!/[!@#$%^&*]/.test(value)) {
    errormsg = 'Password must contain at least one special character';
  }
}

 if (name === 'gender') {
    if (!value || value.trim() === '') {
      errormsg = 'Please select gender';
    }
  }

  if (name === 'hobbies') {
  if (!Array.isArray(value) || value.length === 0) {
    errormsg = 'Select at least one hobby';
  }
}
if (name === 'country') {
  if (!value || value.trim() === '') {
    errormsg = 'Please select a country';
  }
}
if (name === 'address') {
  if (!value || value.trim() === '') {
    errormsg = 'Address is required';
  } else if (value.trim().length < 10) {
    errormsg = 'Address must be at least 10 characters';
  } else if (value.trim().length > 200) {
    errormsg = 'Address cannot exceed 200 characters';
  }
}
if (name === 'photo') {
  if (value) {  // validate only if user selected a file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(value.type)) {
      errormsg = 'Only JPG/PNG files are allowed';
    } else if (value.size > 5 * 1024 * 1024) { // 5 MB
      errormsg = 'File size must be less than 5MB';
    }
  }
}

return errormsg;
}
