import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";

const RegisterView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { push } = useRouter();
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        const form = event.target as HTMLFormElement;
        const data = {
            email: form.email.value,
            fullname: form.fullname.value,
            phone: form.phone.value,
            password: form.password.value,
        }

        const result = await fetch('/api/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (result.status === 200) {
            form.reset();
            push('/auth/login');
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setError('Email is already registered')
            console.log('error');
        }
    }

    return (
        <div className={styles.register}>
            <h1 className={styles.register__title}>Register</h1>
            {error && <p className={styles.register__error}>{error}</p>}
            <div className={styles.register__form}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.register__form__item}>
                        <label htmlFor="email">Email</label>
                        <input className={styles.register__form__item__input} type="email" id="email" name="email" />
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="fullname">Fullname</label>
                        <input className={styles.register__form__item__input} type="text" id="fullname" name="fullname" />
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="phone">phone</label>
                        <input className={styles.register__form__item__input} type="text" id="phone" name="phone" />
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="password">password</label>
                        <input className={styles.register__form__item__input} type="password" id="password" name="password" />
                    </div>
                    <button type="submit" className={styles.register__form__button}>{isLoading ? 'Loading...' : 'Register'}</button>
                </form>
            </div>
            <p className={styles.register__link}>Have an account? Sign in <Link href="/auth/login">here</Link></p>
        </div>
    );
}

export default RegisterView;
