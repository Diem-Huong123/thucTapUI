import React, { useEffect, useState } from "react";
import "./css/team.css";
import AddTeamForm from "./AddTeamForm";
import DeveloperList from "../Developer/DeveloperList";

import EditTeamForm from "./EditTeamForm";
import ApplicationList from "../Application/ApplicationList";

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [addTeamModal, setAddTeamModal] = useState(false);
    const [editTeamModal, setEditTeamModal] = useState({
        visible: false,
        team: null,
    });

    useEffect(() => {
        fetch("http://localhost:8099/api/teams")
            .then((res) => res.json())
            .then((data) => setTeams(data))
            .catch((err) => console.error("Error fetching teams:", err));
    }, []);

    const toggleExpand = (teamId) => {
        setExpandedTeam((prev) => (prev === teamId ? null : teamId));
    };

    const handleAddTeam = (newTeam) => {
        setTeams((prev) => [...prev, newTeam]);
    };

    const handleDelete = async (teamId, teamName) => {

        const confirmDelete = window.confirm(
            `Xóa nhóm sẽ xóa quan hệ của thành viên với nhóm "${teamName}", xóa hết ứng dụng của nhóm ? Chắc chắn muốn xóa nhóm này chứ ? HỆ THỐNG CHƯA HOÀN CHỈNH => KHÔNG NÊN XÓA`
        );

        if (!confirmDelete) return; // If user cancels, exit the function

        try {
            await fetch(`http://localhost:8099/api/teams/${teamId}`, {
                method: "DELETE",
            });
            setTeams((prev) => prev.filter((t) => t.team_id !== teamId));
        } catch (err) {
            console.error("Failed to delete team:", err);
        }
    };

    const handleEdit = (team) => {
        setEditTeamModal({ visible: true, team }); // Open the form with the selected team
    };

    return (
        <div>
            <div className="part-1-heading">
                <h2>Nhóm</h2>

                <button
                    className="add-team-button"
                    onClick={() => setAddTeamModal(true)}
                >
                    Thêm nhóm
                </button>
            </div>
            {/* FORM ADD new team */}
            {addTeamModal && (
                <AddTeamForm
                    onClose={() => setAddTeamModal(false)}
                    onTeamAdded={handleAddTeam}
                />
            )}{" "}
            {/* TEAM FIELD */}
            <div className="part-2-team-container">
                {teams.map((team) => (
                    <div className="team-card" key={team.team_id}>
                        {/* PART 1 : Name + Button delete, edit */}
                        <div
                            className="team-card-header"
                            onClick={() => toggleExpand(team.team_id)}
                        >
                            <div>
                                <p>{team.name}</p>
                            </div>
                            <div className="team-card-button-group">
                                {/* BUTTON Delete */}
                                <button
                                    className="delete-team-button"
                                    onClick={() => {
                                        handleDelete(team.team_id, team.name);
                                    }}>
                                    Xóa nhóm
                                </button>
                                {/* BUTTON EDIT */}
                                <button
                                    className="edit-team-button"
                                    onClick={() => {
                                        handleEdit(team);
                                    }}
                                >
                                    Sửa nhóm
                                </button>

                                {/* FORM EDIT team */}
                                {editTeamModal.visible && (
                                    <EditTeamForm
                                        team={editTeamModal.team}
                                        onClose={() =>
                                            setEditTeamModal({ visible: false, team: null })
                                        }
                                        onTeamUpdated={(updatedTeam) => {
                                            setTeams((prev) =>
                                                prev.map((t) =>
                                                    t.team_id === updatedTeam.team_id ? updatedTeam : t
                                                )
                                            );
                                            setEditTeamModal({ visible: false, team: null });
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* PART 2 : Description Team box*/}
                        {expandedTeam === team.team_id && (
                            <div className="description-box">
                                <p>Description: {team.description}</p>
                            </div>
                        )}

                        {/* PART 3 : Developer */}
                        {expandedTeam === team.team_id && (
                            <div className="developer-list">
                                <h4>Team Members</h4>
                                <DeveloperList teamId={team.team_id} />
                            </div>
                        )}

                        {/* PART 3 : Application */}
                        {expandedTeam === team.team_id && (
                            <div className="application-list">
                                <h4>Application List</h4>
                                <ApplicationList teamId={team.team_id} />
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamList;
