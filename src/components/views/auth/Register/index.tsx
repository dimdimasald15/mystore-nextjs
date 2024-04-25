import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/router";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import authServices from "@/services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

type Propstypes = {
    setToaster: Dispatch<SetStateAction<{}>>;
};
const RegisterView = ({ setToaster }: Propstypes) => {
    const [isLoading, setIsLoading] = useState(false);
    const { push } = useRouter();
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form = event.target as HTMLFormElement;
        const data = {
            email: form.email.value,
            fullname: form.fullname.value,
            phone: form.phone.value,
            password: form.password.value,
        };

        try {
            const result = await authServices.registerAccount(data);
            if (result.status === 200) {
                form.reset();
                setIsLoading(false);
                push("/auth/login");
                setToaster({
                    variant: "success",
                    message: `Success register account`,
                });
            } else {
                setIsLoading(false);
                setToaster({
                    variant: "danger",
                    message: `Register Failed, please call support`,
                });
            }
        } catch (error) {
            setIsLoading(false);
            setToaster({
                variant: "danger",
                message: `Register failed, email is already exist`,
            });
        }
    };

    return (
        <AuthLayout
            title="Registration"
            linkText="Have an account? Sign in "
            link="/auth/login"
        >
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="email" name="email" className={styles.register__form__input} />
                <Input label="Fullname" type="text" name="fullname" className={styles.register__form__input} />
                <Input label="Phone" type="number" name="phone" className={styles.register__form__input} />
                <Input label="Password" type="password" name="password" className={styles.register__form__input} />
                <Button
                    type="submit"
                    variant="primary"
                    className={styles.register__button}
                >
                    {isLoading ? "Loading..." : "Register"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default RegisterView;
