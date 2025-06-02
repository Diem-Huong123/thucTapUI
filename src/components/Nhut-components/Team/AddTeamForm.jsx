import React, { useState } from "react";
import "./css/addTeamForm.css";

const AddTeamForm = ({ onClose, onTeamAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTeam = { name, description };

    try {
      const res = await fetch("http://localhost:8099/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      });

      const data = await res.json();
      onTeamAdded(data);
      onClose();
    } catch (err) {
      console.error("Error adding team:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Thêm Nhóm Mới</h3>
        <form onSubmit={handleSubmit}>
          <input class="element-form"
            type="text"
            placeholder="Tên nhóm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <textarea class="element-form"
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <br />
          <button class="button-form" type="submit">Lưu</button>
          <button class="button-form" type="button" onClick={onClose}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamForm;
