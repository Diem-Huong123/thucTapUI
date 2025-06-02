import { useEffect, useState } from "react";
import "./css/DashboarApplication.css"
import AddApplicationForm from "./AddApplicationForm";

const DashboarApplication = () => {


    const [applicationList, setApplicationList] = useState([]);
    const [applicationAdd, setApplicationAdd] = useState({});
    const [showFormAddApplication, setShowFormAddApplication] = useState(false);

    // Get all applications
    useEffect(() => {
        fetch(`http://localhost:8099/api/applications/fullInfor`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Fail to fetch all application");
            })
            .then((appList) => {
                setApplicationList(appList);
            })
            .catch((err) => {
                alert(err);
            })
    }, []);

    const handleAddApplication = (applicationAdded) => {
        setApplicationList((prev) => [...prev, applicationAdded]);
    }

    const handleDeleteApplication = async (application_id) => {
        alert("Xác nhận xóa ứng dụng của lập trình viên trong nhóm, lập trình viên vẫn trong nhóm")

        try {
            await fetch(`http://localhost:8099/api/applications/${application_id}`, {
                method: "DELETE",
            });
            setApplicationList((prev) => prev.filter((t) => t.application_id !== application_id));
        } catch (err) {
            console.error("Failed to delete application:", err);
        }
    }
    return (
        <div>
            <h1>Application Dashboard</h1>

            <button onClick={() =>
                setShowFormAddApplication(true)
            }>Thêm ứng dụng
            </button>

            {showFormAddApplication && (
                <AddApplicationForm
                    onClose={() => setShowFormAddApplication(false)}
                    onTeamAdd={handleAddApplication}
                />
            )}{""}


            <div>
                <table className="application-table-listAll">

                    {/* Table heading */}
                    <thead>
                        <tr>
                            <th>Tên ứng dụng</th>
                            <th>Mô tả</th>
                            <th>Nhóm</th>
                            <th>Lập trình viên</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>


                    {/* Table body */}
                    <tbody className="application-table-listAll-body">

                        {applicationList.map((app) => (
                            
                        <tr key={app.application_id}>
                            {console.log("Application ID: " + app.application_id)}
                            <td>{app.name}</td>
                            <td>{app.description}</td>
                            <td>{app.teamName}</td>
                            <td>{app.developerFullName}</td>
                            <td>
                                <button onClick={() => {
                                    console.log("Gia tri ID: ")
                                    handleDeleteApplication(app.application_id);
                                }}>
                                    Xóa ứng dụng
                                </button>
                            </td>
                            <td>
                                <button>
                                    Chỉnh sửa
                                </button>
                            </td>
                        </tr>

                        ))}
                    </tbody>


                </table>
            </div>

        </div>
    );
}

export default DashboarApplication;