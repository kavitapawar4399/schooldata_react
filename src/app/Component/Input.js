export default function Input(props) {
  const { label, name, type, placeholder,fileRef, options, val, fnchange,error} = props;

    
  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'password':
        return (
          <input onChange={fnchange} className="form-control"
            name={name}
            type={type}
              value={val || ""}
            placeholder={placeholder}
          />
        );

   case 'radio':
  return options.map((opt, index) => (
    <label
      key={index}
      style={{ display: 'inline-block', marginRight: '15px' }}
    >
      <input
        onChange={fnchange}
        type="radio"
        name={name}
        value={opt}
        checked={val === opt}  // bind selected value
      />{' '}
      {opt}
    </label>
  ));

 case 'checkbox':
  return options.map((opt, index) => (
    <label
      key={index}
      style={{ display: 'inline-block', marginRight: '15px' }}
    >
      <input
        type="checkbox"
        name={name}
        value={opt}
        checked={Array.isArray(val) ? val.includes(opt) : false} // controlled
        onChange={(e) => {
          let newVal = Array.isArray(val) ? [...val] : [];
          if (e.target.checked) {
            newVal.push(opt); // add selected
          } else {
            newVal = newVal.filter(v => v !== opt); // remove unselected
          }

          // call parent's fnchange
          fnchange({ target: { name, value: newVal } });
        }}
      />{' '}
      {opt}
    </label>
  ));


    case 'dropdown':
  return (
    <select
      onChange={fnchange}
      className="form-select"
      name={name}
      value={val || ""}  // controlled
    >
      <option value="">Select</option> {/* default empty */}
      {options.map((opt, index) => (
        <option key={index} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );

case 'textArea':
  return (
    <textarea
      onChange={fnchange}
      className="form-control col-sm-6"
      name={name}
      value={val || ""}  // controlled input
      placeholder={placeholder}
      rows={5}
      style={{ height: '120px' }}
    />
  );
   
    case 'file':
  return (
    <input
      type="file"
      name={name}
       ref={fileRef}
      onChange={(e) => fnchange({ target: { name, value: e.target.files[0] } })}
      className="form-control"
    />
  );
  default:
    return null;
  }
};

  return (
    <div className="row mb-3 align-items-center">
      <div className="col-sm-4 text-end fw-semibold">
        {label}
      </div>
       {label && <div className="col-sm-1 text-center">:</div>}
     
      <div className="col-sm-4">
        {renderInput()}
      </div>
      <div className="col-sm-3">
      {error &&  <b className="text-danger">
        {error}</b>} 
      </div>
    </div>
  );
}
