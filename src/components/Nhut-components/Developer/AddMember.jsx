import React, { useEffect, useState } from "react";
import "./css/addMemberForm.css"; // custom style for modal

const AddMemberForm = ({ teamId, onClose, onMemberAdded }) => {
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8099/api/developers/withoutTeam")
      .then((res) => res.json())
      .then((data) => setDevelopers(data))
      .catch((err) => console.error("Error fetching developers:", err));
  }, []);

  const handleAdd = (developer) => {
    const updatedDeveloper = {
      developer_id: developer.developer_id,
      userName: developer.userName,
      fullName: developer.fullName,
      password: developer.password,
      team_id: teamId,
    };

    fetch("http://localhost:8099/api/developers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDeveloper),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add member to team");
        return res.json();
      })
      .then((data) => {
        onMemberAdded(updatedDeveloper); // Update list in parent
        console.log("Thêm thành viên vào Team thành công");
        onClose(); // Close modal
      })
      .catch((err) => {
        console.error("Error updating developer:", err);
        alert("Thêm thành viên thất bại");
      });
  };

  return (
    <div className="modal-overlay">
      <div className="add-member-modal">
        <h2>Chọn thành viên</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="developer-list">
          {developers.map((dev) => (
            <div key={dev.developer_id} className="developer-item">
              <div>
                <p>
                  <strong>{dev.fullName}</strong> - {dev.userName}
                </p>
              </div>
              <button
                className="add-this-member-button"
                onClick={() => handleAdd(dev)}
              >
                Thêm
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMemberForm;
