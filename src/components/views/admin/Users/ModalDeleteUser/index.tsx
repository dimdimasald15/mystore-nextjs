import styles from "./ModalDeleteUser.module.scss";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { User } from "@/types/user.type";

type PropTypes = {
    deletedUser: User | any;
    setDeletedUser: Dispatch<SetStateAction<{}>>;
    setUsersData: Dispatch<SetStateAction<User[]>>;
    setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalDeleteUser = (props: PropTypes) => {
    const { deletedUser, setDeletedUser, setUsersData, setToaster } =
        props;

    const [isLoading, setIsLoading] = useState(false);
    const handleDeleteUser = async () => {
        const result = await userServices.deleteUser(deletedUser.id);

        if (result.status === 200) {
            setIsLoading(false);
            setToaster({
                variant: "success",
                message: `Success delete user`,
            });
            setDeletedUser({});
            const { data } = await userServices.getAllUsers();
            setUsersData(data.data);
        } else {
            setIsLoading(false);
            setToaster({
                variant: "danger",
                message: `Failed delete user`,
            });
        }
    };
    return (
        <>
            <Modal onClose={() => setDeletedUser({})}>
                <div className={styles.modalDelete__main}>
                    <h1 className={styles.modalDelete__main__title}>Are you sure?</h1>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDeleteUser()}
                        className={styles.modalDelete__main__button}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ModalDeleteUser;
