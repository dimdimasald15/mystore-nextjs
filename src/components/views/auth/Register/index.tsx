import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import authServices from "@/services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

const RegisterView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { push } = useRouter();
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");
        const form = event.target as HTMLFormElement;
        const data = {
            email: form.email.value,
            fullname: form.fullname.value,
            phone: form.phone.value,
            password: form.password.value,
        };

        const result = await authServices.registerAccount(data);

        if (result.status === 200) {
            form.reset();
            push("/auth/login");
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setError("Email is already registered");
            console.log("error");
        }
    };

    return (
        <AuthLayout
            title="Registration"
            error={error}
            linkText="Have an account? Sign in "
            link="/auth/login"
        >
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="email" name="email" />
                <Input label="Fullname" type="text" name="fullname" />
                <Input label="Phone" type="number" name="phone" />
                <Input label="Password" type="password" name="password" />
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
