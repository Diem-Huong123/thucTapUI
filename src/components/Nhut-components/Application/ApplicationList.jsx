import React, { useEffect, useState } from "react";
import "./css/ApplicationList.css"

const ApplicationList = ({ teamId }) => {

    const [applications, setApplication] = useState([]);

    // Fetch All application by teamId
    useEffect(() => {

        if (!teamId) return;

        fetch(`http://localhost:8099/api/applications/getByTeam/${teamId}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Fail to fetch Application with teamId");
            })
            .then((data) => {
                setApplication(data);
            })
            .catch((err) => {
                alert("Fail fetch data : " + err)
            })
    }, [teamId]);


    return (
        <div>
            <table className="application-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Developer</th>

                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <tr key={app.application_id}>
                            <td>{app.name}</td>
                            <td>{app.description}</td>
                            <td>{app.developerFullName}</td>

                            <td>
                                <button className="delete-application-button">Xóa ứng dụng</button>

                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default ApplicationList;