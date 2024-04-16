import styles from "./Select.module.scss";
type Options = {
    label: string;
    value: string;
}

type Propstypes = {
    label?: string; //opsional
    name: string;
    defaultValue?: string;
    disabled?: boolean;
    options: Options[];
};

const Select = (props: Propstypes) => {
    const { label, name, defaultValue, disabled, options } = props;
    return (
        <>
            <div className={styles.container}>
                <label htmlFor={name}>{label}</label>
                <select
                    className={styles.container__select}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    disabled={disabled}
                >
                    {
                        options.map((option) => (
                            <option
                                key={option.label}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))
                    }
                </select>
            </div>
        </>
    );
}

export default Select