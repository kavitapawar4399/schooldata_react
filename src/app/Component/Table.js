import React from 'react';

export const Table = (props) => {
  const { headers = [], imgheaders = [], data = [], columns = [], imgcolumn = [] } = props;

  return (
    <table className='table table-bordered'>
      <thead>
        <tr>
          {[...headers, ...imgheaders].map((val, ind) => (
            <th key={"th" + ind}>{val}</th>
          ))}
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>

      <tbody>
        {data.map((obj, ind) => (
          <tr key={"tr" + ind}>
            
            {/* normal text columns */}
            {columns.map((col, i) => (
              <td key={"td-text" + i}>{obj[col]}</td>
            ))}

            {/* image columns */}
            {imgcolumn.map((col, i) => (
              <td key={"td-img" + i}>
                {obj[col] && (
                  <img
                    src={obj[col]}
                    alt={col}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                )}
              </td>
            ))}
            <td>
              <button className="btn btn-sm btn-warning">Edit</button>
            </td>   
            <td>
              <button className="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

