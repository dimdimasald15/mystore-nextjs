import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { FormEvent, useState } from "react";

type PropType = {
    updatedUser: any;
    setUpdatedUser: any;
    setUsersData: any;
}
const ModalUpdateUser = (props: PropType) => {
    const { updatedUser, setUpdatedUser, setUsersData } = props
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form: any = event.target as HTMLFormElement;
        const data = {
            role: form.role.value,
        };

        const result = await userServices.updateUser(updatedUser.id, data);

        if (result.status === 200) {
            setIsLoading(false);
            setUpdatedUser({});
            const { data } = await userServices.getAllUsers();
            setUsersData(data.data);
        } else {
            setIsLoading(false);
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
                    <Button type="submit" variant="primary">Update</Button>
                </form>

            </Modal>
        </>
    );
}

export default ModalUpdateUser