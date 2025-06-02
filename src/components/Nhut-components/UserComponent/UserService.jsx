import { useEffect, useState } from "react";
import "./css/UserService.css"
const UserService = () => {

    const [developer, setDeveloper] = useState([]);
    const [team, setTeam] = useState([]);
    const currentUser = 1;

    useEffect(() => {
        fetch(`http://localhost:8099/api/developers/getOne/${currentUser}`)
            .then((res) => res.json())
            .then((data) => setDeveloper(data))
            .catch((err) => console.error("Error fetching developers:", err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8099/api/teams/${currentUser}`)
            .then((res) => res.json())
            .then((data) => setTeam(data))
            .catch((err) => console.error("Error fetching developers:", err));
    }, [developer]);

    return (
        <div>
            <div className="user-infor-container">
                <div className="user-infor">
                    <h1>User Information</h1>
                    <p>User Name : {developer.userName}</p>
                    <p>Full Name : {developer.fullName}</p>
                    <p>Team Id : {developer.teamId}</p>
                    <p>Team Name : {developer.userName}</p>

                </div>
            </div>

            <div className="team-infor-container">
                <div className="team-infor">
                    <h1>Your Team</h1>
                    <p>Team name: {team.name}</p>
                    <p>Team description: {team.description}</p>

                </div>
            </div>
            <h1>Dịch vụ của bạn</h1>
        </div>
    )
}
export default UserService;