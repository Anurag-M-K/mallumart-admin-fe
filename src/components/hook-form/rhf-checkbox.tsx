import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
}

export default function RHFCheckbox({ name, helperText, label, className, ...other }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <div>
                        <label className="">
                            <input type="checkbox" checked={field.value} {...field} className="form-checkbox" {...other} />
                            <span>{label}</span>
                        </label>
                        {(helperText || error) && <span className={`text-xs text-white-dark ${error?.message && '!text-danger'}`}>{error?.message || helperText}</span>}
                    </div>
                );
            }}
        />
    );
}
