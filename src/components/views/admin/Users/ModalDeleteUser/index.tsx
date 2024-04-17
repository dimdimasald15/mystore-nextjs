import styles from "./ModalDeleteUser.module.scss";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react"

type PropType = {
    deletedUser: any;
    setDeletedUser: any;
    setUsersData: any;
}
const ModalDeleteUser = (props: PropType) => {
    const { deletedUser, setDeletedUser, setUsersData } = props
    const session: any = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const handleDeleteUser = async () => {
        userServices.deleteUser(deletedUser.id, session.data?.accessToken)
        setDeletedUser({});
        const { data } = await userServices.getAllUsers();
        setUsersData(data.data);
    }
    return (
        <>
            <Modal onClose={() => setDeletedUser({})}>
                <h1 className={styles.modal__title}>Are you sure?</h1>
                <Button type="button" variant="danger"
                    onClick={() => handleDeleteUser()}
                    className={styles.modal__button}
                >Delete</Button>
            </Modal>
        </>
    );
}

export default ModalDeleteUser