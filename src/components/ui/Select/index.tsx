import styles from "./Select.module.scss";
type Options = {
    label: string;
    value: string;
    selected?: boolean
}

type Propstypes = {
    label?: string; //opsional
    name: string;
    defaultValue?: string;
    disabled?: boolean;
    options: Options[] | any;
    className?: string;
};

const Select = (props: Propstypes) => {
    const { label, name, defaultValue, disabled, options, className } = props;

    return (
        <>
            <div className={styles.container}>
                <label htmlFor={name}>{label}</label>
                <select
                    className={`${styles.container__select} ${className}`}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    disabled={disabled}
                >
                    {
                        options?.map((option: Options) => (
                            <option
                                key={option.label}
                                value={option.value}
                                selected={option.selected}
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