import Button from "@/components/ui/Button";
import styles from "./Users.module.scss";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";
import { User } from "@/types/user.type";
import { useSession } from "next-auth/react";

type PropTypes = {
    users: User[];
    setToaster: Dispatch<SetStateAction<{}>>;
};

const UsersAdminView = (props: PropTypes) => {
    const { users, setToaster } = props;
    const [updatedUser, setUpdatedUser] = useState<User | {}>({});
    const [deletedUser, setDeletedUser] = useState<User | {}>({});
    const [usersData, setUsersData] = useState<User[]>([]);
    const session: any = useSession();

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
                            {usersData.map((user: User, index: number) => (
                                <tr key={user.id}>
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
                    setToaster={setToaster}
                    session={session}
                />
            )}
            {Object.keys(deletedUser).length && (
                <ModalDeleteUser
                    deletedUser={deletedUser}
                    setDeletedUser={setDeletedUser}
                    setUsersData={setUsersData}
                    setToaster={setToaster}
                    session={session}
                />
            )}
        </div>
    );
};

export default UsersAdminView;
