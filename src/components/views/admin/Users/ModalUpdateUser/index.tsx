import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { User } from "@/types/user.type";
import styles from "./ModalUpdateUser.module.scss";
type PropTypes = {
    updatedUser: User | any;
    setUpdatedUser: Dispatch<SetStateAction<{}>>;
    setUsersData: Dispatch<SetStateAction<User[]>>;
    setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalUpdateUser = (props: PropTypes) => {
    const { updatedUser, setUpdatedUser, setUsersData, setToaster } =
        props;
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form: any = event.target as HTMLFormElement;
        const fullname = form.fullname.value;
        const role = form.role.value;
        const data = {
            role: role,
        };

        const result = await userServices.updateUser(
            updatedUser.id,
            data
        );

        if (result.status === 200) {
            setIsLoading(false);
            setUpdatedUser({});
            const { data } = await userServices.getAllUsers();
            setUsersData(data.data);
            setToaster({
                variant: "success",
                message: `${fullname} role's updated to ${role}`,
            });
        } else {
            setIsLoading(false);
            setToaster({
                variant: "danger",
                message: `${fullname} role's update failed`,
            });
        }
    };
    return (
        <>
            <Modal onClose={() => setUpdatedUser({})}>
                <h1>Update User</h1>
                <form onSubmit={handleUpdateUser}>
                    <Input
                        className={styles.form__input}
                        label="Email"
                        type="email"
                        name="email"
                        defaultValue={updatedUser.email}
                        disabled
                    />
                    <Input
                        className={styles.form__input}
                        label="Fullname"
                        type="text"
                        name="fullname"
                        defaultValue={updatedUser.fullname}
                        disabled
                    />
                    <Input
                        className={styles.form__input}
                        label="Phone"
                        type="number"
                        name="phone"
                        defaultValue={updatedUser.phone}
                        disabled
                    />
                    <Select
                        label="Role"
                        name="role"
                        defaultValue={updatedUser.role}
                        options={[
                            { label: "Member", value: "member" },
                            { label: "Admin", value: "admin" },
                        ]}
                    />
                    <div className={styles.form__btn}>
                        <Button type="submit" className={styles.form__btn_button}>
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ModalUpdateUser;
