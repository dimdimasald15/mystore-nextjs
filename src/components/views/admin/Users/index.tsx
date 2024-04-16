import Button from "@/components/ui/Button";
import styles from "./Users.module.scss";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useEffect, useState } from "react";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";
import userServices from "@/services/user";

type PropType = {
    users: any;
};

const UsersAdminView = (props: PropType) => {
    const { users } = props;
    const [updatedUser, setUpdatedUser] = useState<any>({});
    const [deletedUser, setDeletedUser] = useState<any>({});
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        setUsersData(users);
    }, [users]);

    return (
        <div>
            <AdminLayout>
                <div className={styles.users}>
                    <h1>Users Management</h1>
                    <table className={styles.users__table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fullname</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user: any, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className={styles.users__table__action}>
                                            <Button
                                                type="button"
                                                variant="warning"
                                                onClick={() => setUpdatedUser(user)}
                                                className={styles.users__table__action__button}
                                            >
                                                <i className="bx bx-edit"></i>
                                            </Button>
                                            <Button type="button" variant="danger"
                                                className={styles.users__table__action__button}
                                                onClick={() => setDeletedUser(user)}
                                            >
                                                <i className="bx bx-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>
            {Object.keys(updatedUser).length && (
                <ModalUpdateUser
                    updatedUser={updatedUser}
                    setUpdatedUser={setUpdatedUser}
                    setUsersData={setUsersData}
                />
            )}
            {Object.keys(deletedUser).length && (
                <ModalDeleteUser
                    deletedUser={deletedUser}
                    setDeletedUser={setDeletedUser}
                    setUsersData={setUsersData}
                />
            )}
        </div>
    );
};

export default UsersAdminView;
