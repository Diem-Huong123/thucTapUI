import { useEffect, useState } from "react";
import "./css/AddApplicationForm.css"

const AddApplicationForm = ({ onClose, onTeamAdd }) => {

    const [name, setName] = useState("");
    const [teamId, setTeamId] = useState("");
    const [description, setDescription] = useState("");
    const [developer_id, setDeveloper_id] = useState("");

    const [developerList, setDeveloperList] = useState([]);
    const [teamList, setTeamList] = useState([]);


    // Fetch list of team
    useEffect(() => {

        fetch(`http://localhost:8099/api/teams`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Fail to fetch List team");
            })
            .then((data) => {
                setTeamList(data);
            })
            .catch((err) => {
                alert("Fail fetch data : " + err)
            })
    }, []);

    // Fetch list of developer without team
    useEffect(() => {
        if (!teamId) {
            setDeveloperList([]); 
            return; // Do not fetch if no team is selected
        }
        fetch(`http://localhost:8099/api/developers/${teamId}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Fail to fetch List developers in teamID : " + teamId);
            })
            .then((data) => {
                setDeveloperList(data);
            })
            .catch((err) => {
                alert("Fail fetch data : " + err)
            })
    }, [teamId]);


    const handleAddApplication = async (e) => {

        e.preventDefault(); // prevent loading page

        const newApplication = {
            name,
            teamId,
            description,
            developer_id
        };

        try {
            const res = await fetch("http://localhost:8099/api/applications/adminCreate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newApplication)
            });

            if (!res.ok) throw new Error("Failed to add application");

            const data = await res.json();
            onTeamAdd(data);
            alert("Ứng dụng đã được thêm thành công!");
            onClose(); // Close the modal
        } catch (err) {
            alert("Lỗi khi thêm ứng dụng: " + err.message);
        }
    }

    return (
        <div className="add-app-form-container">
            <div className="add-app-form">
                <h2>Thêm ứng dụng mới</h2>


                <form onSubmit={handleAddApplication} className="form-add">


                    {/* INPUT : name */}
                    <div className="form-element-container">
                        <input className="form-element" type="text"
                            placeholder="Tên ứng dụng"
                            value={name}
                            onChange={(value) => setName(value.target.value)} required />
                    </div>


                    {/* INPUT : teamId */}
                    <div className="form-element-container">
                        <select className="form-element"
                            value={teamId}
                            onChange={(e) =>
                                setTeamId(e.target.value)
                                // getDataDeveloper();
                                // {getDataDeveloper}
                            }
                            required
                        >
                            <option value="">-- Chọn nhóm --</option>
                            {teamList.map((team) => (
                                <option key={team.team_id} value={team.team_id}>
                                    {team.name} - {team.description}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* INPUT : description */}
                    <div className="form-element-container">
                        <input className="form-element" type="text"
                            placeholder="Mô tả"
                            value={description}
                            onChange={(value) => setDescription(value.target.value)} required />
                    </div>

                    {/* INPUT : developer_id */}
                    <div className="form-element-container">
                        <select className="form-element" value={developer_id}
                            onChange={(e) =>
                                setDeveloper_id(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn lập trình viên --</option>
                            {developerList.map((developer) => (
                                <option key={developer.developer_id} value={developer.developer_id}>
                                    {developer.fullName} - {developer.userName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="add-application-button" type="submit">Lưu</button>
                    <button className="cancel-add-application-button" type="button" onClick={onClose}>Hủy</button>
                </form>
            </div>
        </div>
    );
}

export default AddApplicationForm;