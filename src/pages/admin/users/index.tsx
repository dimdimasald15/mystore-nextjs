import UsersAdminView from "@/components/views/admin/Users"
import userServices from "@/services/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type PropTypes = {
    setToaster: Dispatch<SetStateAction<{}>>;
};
const AdminUsersPage = (props: PropTypes) => {
    const { setToaster } = props
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getAllUsers = async () => {
            const { data } = await userServices.getAllUsers();
            setUsers(data.data)
        }
        getAllUsers();
    }, [])

    return (<>
        <UsersAdminView users={users} setToaster={setToaster} />
    </>)
}

export default AdminUsersPage