import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react"
import { User } from "@/types/user.type";

type PropTypes = {
    updatedUser: User | any;
    setUpdatedUser: Dispatch<SetStateAction<{}>>;
    setUsersData: Dispatch<SetStateAction<User[]>>;
    setToaster: Dispatch<SetStateAction<{}>>
    session: any;
}
const ModalUpdateUser = (props: PropTypes) => {
    const { updatedUser, setUpdatedUser, setUsersData, setToaster, session } = props
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form: any = event.target as HTMLFormElement;
        const fullname = form.fullname.value;
        const role = form.role.value;
        const data = {
            role: role
        };

        const result = await userServices.updateUser(updatedUser.id, data, session.data?.accessToken);

        if (result.status === 200) {
            setIsLoading(false);
            setUpdatedUser({});
            const { data } = await userServices.getAllUsers();
            setUsersData(data.data);
            setToaster({
                variant: 'success',
                message: `${fullname} role's updated to ${role}`
            })
        } else {
            setIsLoading(false);
            setToaster({
                variant: 'danger',
                message: `${fullname} role's update failed`
            })
        }
    };
    return (
        <>
            <Modal onClose={() => setUpdatedUser({})}>
                <h1>Update User</h1>
                <form onSubmit={handleUpdateUser}>
                    <Input label="Email" type="email" name="email" defaultValue={updatedUser.email} disabled />
                    <Input label="Fullname" type="text" name="fullname" defaultValue={updatedUser.fullname} disabled />
                    <Input label="Phone" type="number" name="phone" defaultValue={updatedUser.phone} disabled />
                    <Select label="Role" name="role" defaultValue={updatedUser.role} options={[
                        { label: "Member", value: "member" },
                        { label: "Admin", value: "admin" },
                    ]} />
                    <Button type="submit" variant="primary">
                        {isLoading ? "Updating..." : "Update"}
                    </Button>
                </form>

            </Modal>
        </>
    );
}

export default ModalUpdateUser