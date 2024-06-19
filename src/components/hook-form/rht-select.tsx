import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

type RHFSelectProps = React.InputHTMLAttributes<HTMLSelectElement> & {
    name: string;
    label?: string;
    maxHeight?: boolean | number;
    className?: string;
    helperText?: string;
    children: React.ReactNode;
};

export function RHFSelect({ name, children, label, helperText, className, ...other }: RHFSelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    {label && <label htmlFor={name}>{label}</label>}
                    <select {...field} className={'form-select ' + className} {...other}>
                        {children}
                    </select>
                    {helperText || (error && <span className={`text-xs text-white-dark ${error.message && '!text-danger'}`}>{error.message || helperText}</span>)}
                </div>
            )}
        />
    );
}
