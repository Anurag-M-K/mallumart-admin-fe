import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
}

export default function RHFSwitch({ name, helperText, label, className, ...other }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <div>
                        <label className="flex w-fit items-center gap-2">
                            <div className="w-9 h-5 relative shrink-0">
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    {...field}
                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                    id="custom_switch_checkbox1"
                                    {...other}
                                />
                                <span
                                    className={`bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-5 peer-checked:bg-primary before:transition-all before:duration-300 ${className}`}
                                />
                            </div>
                            <span className="font-light">{label}</span>
                        </label>
                        {(helperText || error) && <span className={`text-xs text-white-dark ${error?.message && '!text-danger'}`}>{error?.message || helperText}</span>}
                    </div>
                );
            }}
        />
    );
}
