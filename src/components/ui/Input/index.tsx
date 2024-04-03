import styles from "./Input.module.scss";
type Propstypes = {
    label?: string; //opsional
    name: string;
    type: string;
    placeholder?: string;
};

const Input = (props: Propstypes) => {
    const { label, name, type, placeholder } = props;
    return (
        <>
            <div className={styles.container}>
                {label &&
                    <label htmlFor={name}>{label}</label>
                }
                <input
                    className={styles.container__input}
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                />
            </div>
        </>
    );
};

export default Input;
