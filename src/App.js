import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Import your CSS file for additional styling

function App() {
  const [formVal, setFormVal] = useState([
    {
      name: "",
      email: "",
      gender: "",
      qualification: "",
      governmentId: false,
      governmentIdProof: null,
    },
  ]);
  const [jsonData, setJsonData] = useState(null);

  const addRow = () => {
    setFormVal([
      ...formVal,
      {
        name: "",
        email: "",
        gender: "",
        qualification: "",
        governmentId: false,
        governmentIdProof: null,
      },
    ]);

    toast.success("New row added successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const onRemove = (i) => {
    const newForm = [...formVal];
    newForm.splice(i, 1);
    setFormVal(newForm);

    toast.success("Row removed successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const onHandle = (e, i) => {
    let newForm = [...formVal];
    if (e.target.type === "radio") {
      newForm[i].gender = e.target.value;
    } else if (e.target.type === "checkbox") {
      newForm[i].governmentId = e.target.checked;
      // Clear the existing proof when unchecking the checkbox
      if (!e.target.checked) {
        newForm[i].governmentIdProof = null;
      }
    } else if (e.target.type === "file") {
      // Handle file upload for Government ID proof
      newForm[i].governmentIdProof = e.target.files[0];
    } else {
      newForm[i][e.target.name] = e.target.value;
    }
    setFormVal(newForm);
  };

  const formValidation = (data) => {
    var re = /\S+@\S+\.\S+/;
    let valid = true;

    if (data.name === "") {
      data.nameCheck = "Name is required";
      data.nameLengthCheck = "";
      valid = false;
    } else if (data.name.length < 10) {
      data.nameLengthCheck = "Name should be greater than 10 characters";
      data.nameCheck = "";
      valid = false;
    } else {
      data.nameCheck = "";
      data.nameLengthCheck = "";
    }

    if (data.email === "") {
      data.emailCheck = "Email is required";
      data.emailFormat = "";
      valid = false;
    } else if (!re.test(data.email)) {
      data.emailFormat = "Invalid Email";
      data.emailCheck = "";
      valid = false;
    } else {
      data.emailCheck = "";
      data.emailFormat = "";
    }

    if (data.gender === "") {
      data.genderCheck = "Gender is required";
      valid = false;
    } else {
      data.genderCheck = "";
    }

    if (data.qualification === "") {
      data.qualificationCheck = "Qualification is required";
      valid = false;
    } else {
      data.qualificationCheck = "";
    }

    return valid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Check if at least one row is filled
    const isAnyRowFilled = formVal.some(
      (item) =>
        item.name.trim() !== "" ||
        item.email.trim() !== "" ||
        item.gender.trim() !== "" ||
        item.qualification.trim() !== ""
    );

    if (!isAnyRowFilled) {
      toast.error("Please fill at least one row before submitting!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const displayData = formVal
      .filter((item) => {
        // Filter out rows that are not filled
        return (
          item.name.trim() !== "" &&
          item.email.trim() !== "" &&
          item.gender.trim() !== "" &&
          item.qualification.trim() !== ""
        );
      })
      .map((item, index) => {
        // Validate each filled row
        const isValid = formValidation(item);

        if (isValid) {
          return {
            name: item.name,
            email: item.email,
            gender: item.gender,
            qualification: item.qualification,
            governmentId: item.governmentId,
            governmentIdProof: item.governmentIdProof,
          };
        } else {
          return {
            name: item.name,
            email: item.email,
            error: "Incomplete data. Please fill in all fields.",
          };
        }
      });

    setJsonData(JSON.stringify(displayData, null, 2));

    // Display success toast only if all rows are complete
    if (isAnyRowFilled) {
      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Professional Form</h1>
        <form onSubmit={onSubmit}>
          {formVal.map((item, i) => (
            <div key={i} className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={item.name || ""}
                  onChange={(e) => onHandle(e, i)}
                />
                <div className="error-message">
                  {item.nameCheck}
                  <br />
                  {item.nameLengthCheck}
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={item.email || ""}
                  onChange={(e) => onHandle(e, i)}
                />
                <div className="error-message">
                  {item.emailCheck}
                  <br />
                  {item.emailFormat}
                </div>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`gender-${i}`}
                      value="male"
                      checked={item.gender === "male"}
                      onChange={(e) => onHandle(e, i)}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`gender-${i}`}
                      value="female"
                      checked={item.gender === "female"}
                      onChange={(e) => onHandle(e, i)}
                    />
                    Female
                  </label>
                </div>
                <div className="error-message">{item.genderCheck}</div>
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <select
                  name="qualification"
                  value={item.qualification || ""}
                  onChange={(e) => onHandle(e, i)}
                >
                  <option value="">Select Qualification</option>
                  <option value="highschool">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
                <div className="error-message">{item.qualificationCheck}</div>
              </div>
              <div className="form-group">
                <label>Government ID</label>
                <input
                  type="checkbox"
                  name="governmentId"
                  checked={item.governmentId}
                  onChange={(e) => onHandle(e, i)}
                />
                {item.governmentId && (
                  <div className="file-upload">
                    <label>Upload Government ID Proof:</label>
                    <input
                      type="file"
                      name="governmentIdProof"
                      onChange={(e) => onHandle(e, i)}
                    />
                  </div>
                )}
              </div>
              {i === 0 ? (
                ""
              ) : (
                <button onClick={() => onRemove(i)} className="remove-button">
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="form-actions">
            <button onClick={addRow} className="add-row-button">
              Add Row
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>

        {jsonData && (
          <div className="submitted-data">
            <h3>Submitted Data (JSON):</h3>
            <pre>{jsonData}</pre>
          </div>
        )}

        {/* Toast container for notifications */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
