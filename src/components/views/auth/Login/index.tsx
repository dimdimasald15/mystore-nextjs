import Link from "next/link";
import styles from "./Login.module.scss";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/layouts/AuthLayout";

type Proptypes = {
    setToaster: Dispatch<SetStateAction<{}>>
};
const LoginView = ({ setToaster }: Proptypes) => {
    const [isLoading, setIsLoading] = useState(false);
    const { push, query } = useRouter();
    const callbackUrl: any = query.callbackUrl || "/";
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form = event.target as HTMLFormElement;
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: form.email.value,
                password: form.password.value,
                callbackUrl,
            });

            if (!res?.error) {
                setIsLoading(false);
                form.reset();
                push(callbackUrl);
                setToaster({
                    variant: 'success',
                    message: `Login successfully`
                })
            } else {
                setIsLoading(false);
                setToaster({
                    variant: 'danger',
                    message: `Email or password is incorrect`
                })
            }
        } catch (error) {
            setIsLoading(false);
            setToaster({
                variant: 'danger',
                message: `Login failed, please call support`
            })
        }
    };

    return (
        <AuthLayout
            title="Login"
            linkText="Don't have an account? Sign up "
            link="/auth/register"
        >
            <div className={styles.login__form}>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                    />
                    <Button type="submit" variant="primary" className={styles.login__button}>
                        {isLoading ? "Loading..." : "Login"}
                    </Button>
                </form>
                <hr className={styles.login__divider} />
                <div className={styles.login__other}>
                    <Button
                        type="button"
                        variant="primary"
                        className={styles.login__other__button}
                        onClick={() => signIn("google", { callbackUrl, redirect: false })}
                    >
                        <i className="bx bxl-google" /> Login with Google
                    </Button>
                </div>
            </div>
        </AuthLayout >
    );
};

export default LoginView;
