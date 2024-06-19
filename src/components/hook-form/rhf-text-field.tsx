import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label?: string;
    helperText?: string;
};

export default function RHFTextField({ name, type, helperText, label, className, ...other }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className='w-full'>
                    {label && <label htmlFor={name}>{label}</label>}
                    <input
                        {...field}
                        type={type}
                        value={type === 'number' && field.value === 0 ? '' : field.value}
                        onChange={(event) => {
                            if (type === 'number') {
                                field.onChange(Number(event.target.value));
                            } else {
                                field.onChange(event.target.value);
                            }
                        }}
                        className={'form-input ' + className}
                        {...other}
                    />
                    {helperText || (error && <span className={`text-xs text-white-dark ${error.message && '!text-danger'}`}>{error.message || helperText}</span>)}
                </div>
            )}
        />
    );
}
