import React, { useState, useEffect } from "react";
import "./css/editTeamForm.css";

const EditTeamForm = ({ team, onClose, onTeamUpdated }) => {
  const [name, setName] = useState(team.name || "");
  const [description, setDescription] = useState(team.description || "");

  useEffect(() => {
    setName(team.name || "");
    setDescription(team.description || "");
  }, [team]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editTeam = {
      team_id: team.team_id, 
      name,
      description,
    };

    console.log("team_id: " + editTeam.team_id + " name: " + editTeam.name + " description: " + editTeam.description);

    try {
      const res = await fetch(`http://localhost:8099/api/teams`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTeam),
      });

      const data = await res.json();
      onTeamUpdated(data);
    } catch (err) {
      console.error("Error editing team:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Chỉnh sửa nhóm</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="element-form"
            type="text"
            placeholder="Tên nhóm mới"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <textarea
            className="element-form"
            placeholder="Mô tả mới"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <br />
          <button className="button-form" type="submit">Lưu</button>
          <button className="button-form" type="button" onClick={onClose}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default EditTeamForm;
