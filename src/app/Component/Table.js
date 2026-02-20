"use client";
import React from "react";

export function Table({ headers = [], imgheaders = [], data = [], columns = [], imgcolumn = [] }) {
  if (!Array.isArray(data)) data = [];

  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{headers[idx] || col}</th>
            ))}
            {imgcolumn.map((col, idx) => (
              <th key={`img-${idx}`}>{imgheaders[idx] || col}</th>
            ))}
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + imgcolumn.length + 2} className="text-center">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={`row-${rowIdx}`}>
                {columns.map((col, colIdx) => (
                  <td key={`td-${rowIdx}-${colIdx}`}>
                    {Array.isArray(row[col]) ? row[col].join(", ") : row[col] || "-"}
                  </td>
                ))}

                {imgcolumn.map((col, colIdx) => (
                  <td key={`img-${rowIdx}-${colIdx}`}>
                    {row[col] ? (
                      <img
                        src={row[col]}
                        alt={col}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      "-"
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}