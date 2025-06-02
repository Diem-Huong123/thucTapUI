import React, { useEffect, useState } from "react";
import "./css/DeveloperList.css";
import AddMemberForm from "./AddMember";

const DeveloperList = ({ teamId }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    if (!teamId) return;

    setLoading(true);
    fetch(`http://localhost:8099/api/developers/${teamId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch developers");
        }
        return res.json();
      })
      .then((data) => {
        setDevelopers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [teamId]);

  if (loading) return <p>Loading developers...</p>;
  if (error) return <p>Error: {error}</p>;
  if (developers.length === 0)
    return (
      <div>
        <p>No developers found.</p>
        <button
          className="add-member-button"
          onClick={() => setShowAddMemberModal(true)}
        >
          Thêm thành viên
        </button>
        {showAddMemberModal && (
          <AddMemberForm
            teamId={teamId}
            onClose={() => setShowAddMemberModal(false)}
            onMemberAdded={(dev) => {
              setDevelopers((prev) => [...prev, dev]); // update team developer list
            }}
          />
        )}
      </div>
    );
  const handleDelete = (developerId) => {
    const developer = developers.find(
      (dev) => dev.developer_id === developerId
    );
    const confirmDelete = window.confirm(
      `Xóa thành viên sẽ xóa luôn ứng dụng của thành viên "${developer.fullName}" khỏi nhóm ? Chắc chắn muốn xóa thành viên này chứ ?
      HỆ THỐNG CHƯA HOÀN CHỈNH => KHÔNG NÊN XÓA`
    );

    if (!confirmDelete) return; // If user cancels, exit the function

    const updatedDeveloper = {
      developer_id: developer.developer_id,
      userName: developer.userName,
      fullName: developer.fullName,
      password: developer.password,
      team_id: null, // REMOVE from team
    };

    fetch("http://localhost:8099/api/developers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDeveloper),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove from team");
        return res.json();
      })
      .then(() => {
        setDevelopers((prev) =>
          prev.filter((dev) => dev.developer_id !== developerId)
        );
      })
      .catch((err) => {
        console.error("Error removing developer:", err);
        alert("Xóa thành viên khỏi nhóm thất bại");
      });
  };
  return (
    <div>
      {/* DEVELOPER TABLE */}
      <table className="developer-table">
        <thead>
          <tr>
            <th>Tên thành viên</th>
            <th>User Name</th>
            <th>
              <button
                className="add-member-button"
                onClick={() => setShowAddMemberModal(true)}
              >
                Thêm thành viên
              </button>

              {showAddMemberModal && (
                <AddMemberForm
                  teamId={teamId}
                  onClose={() => setShowAddMemberModal(false)}
                  onMemberAdded={(dev) => {
                    setDevelopers((prev) => [...prev, dev]); // update team developer list
                  }}
                />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {developers.map((dev) => (

            <tr key={dev.developer_id}>
              {console.log("Developer ID: " + dev.developer_id)}
              <td>{dev.fullName}</td>
              <td>{dev.userName}</td>
              <td>
                <button
                  className="delete-member-button"
                  onClick={() => handleDelete(dev.developer_id)}
                >
                  Xóa khỏi nhóm
                </button>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeveloperList;
