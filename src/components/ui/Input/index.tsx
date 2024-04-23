import styles from "./Input.module.scss";
type Propstypes = {
    label?: string; //opsional
    name: string;
    type: string;
    placeholder?: string;
    defaultValue?: string | number;
    disabled?: boolean;
    onChange?: (e: any) => void;
};

const Input = (props: Propstypes) => {
    const { label, name, type, placeholder, defaultValue, disabled, onChange } = props;
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
                    defaultValue={defaultValue}
                    disabled={disabled}
                    onChange={onChange}
                />
            </div>
        </>
    );
};

export default Input;
