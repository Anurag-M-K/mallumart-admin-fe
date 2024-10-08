import { Button, FileInput, Label, ToggleSwitch, Tooltip } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { IoInformationCircle } from 'react-icons/io5';
import { BiImageAdd } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Compressor from 'compressorjs';
// import Editor from "react-quill/lib/toolbar";
import 'react-quill/dist/quill.snow.css';
import debounce from 'lodash/debounce';

import ValidationError from '../ValidationError';

import { searchUniqueNameExist } from '../../api/staffApi';

interface WrappedSelectProps extends FieldRenderProps<string, HTMLElement> {
    label: string;
    placeholder?: string;
    options: { value: string; label: string }[];
}

const WrappedSelect: React.FC<WrappedSelectProps> = ({ input, meta, label, placeholder, options }) => {
    return (
        <div>
            <label className="text-black">{label}</label>
            <div className="relative text-white-dark">
                <select {...input} className="form-select">
                    {placeholder && <option value="">{placeholder}</option>}
                    {options?.map((option) => (
                        <option key={option?.value} value={option?.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {meta.error && meta.touched && <span className="text-red-500">{meta.error}</span>}
        </div>
    );
};

export default WrappedSelect;

interface WrappedCheckboxProps {
 
    label: string;
    id: string;
    className?: string;
    input: any;
    meta: any;
}
export function WrappedCheckbox({  label, input, ...props }: WrappedCheckboxProps) {
    const [isChecked ,setIsChecked] = useState(false)


    const checkedChange = () => {
        if(input.value){
            setIsChecked(true)
        }else{
            setIsChecked(false)
        }
    }

    useEffect(()=>{
        checkedChange()
    },[])


    const handleOnchange  = (e:any) =>{
        input.onChange(e.target.checked)
        setIsChecked(!isChecked)
    }

    return (
        <div className={`flex-1 mb-3 ${props.className}`}>
            <div className="flex items-center">
                <label htmlFor={props.id} className="block text-black dark:text-white">
                    {label}
                </label>
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={props.id}
                    checked={isChecked}
                    onChange={handleOnchange} // Toggle the value
                />
            </div>
        </div>
    );
}

export const WrappedToggleButton = ({ input, onChange, ...props }: any) => {
    const [switch1, setSwitch1] = useState(false);

    const handleToggle = () => {
        if (input.value === 'active') {
            input.onChane = 'inactive';
        } else {
            input.onChane = 'active';
        }
        // onChange(newValue);
    };

    return (
        <div className="toggle-button">
            <h1 className="mt-2">Status</h1>
            <label htmlFor="">{props.placeholder}</label>
            <ToggleSwitch checked={input.value === 'active' ? true : false} label={input.value === 'active' ? 'Active' : 'Inactive'} onChange={handleToggle} />

            <label htmlFor="toggle" className="toggle-label">
                <div className="toggle-handle"></div>
            </label>
        </div>
    );
};

export function WrappedFileUpload({ initialPreview, ...props }: any) {
    const [selectedFile, setSelectedFile] = useState<any>(undefined);
    const [preview, setPreview] = useState<any>(undefined);
    const [fileType, setFileType] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
            setFileType(selectedFile.type);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (initialPreview) {
            setPreview(initialPreview);
            setFileType('image');
            return;
        } else if (initialPreview?.pdf) {
            setPreview(initialPreview.pdf);
            setFileType('pdf');
            return;
        } else {
            setPreview(undefined);
        }
    }, [selectedFile, initialPreview]);

    const handleSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }
        try {
            new Compressor(e.target.files[0], {
                quality: 0.6,

                success(result) {
                    setSelectedFile(result);
                    props.input.onChange(result);
                },
            });
        } catch (error) {
            console.log('error while compressing image', error);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(undefined);
        setPreview(undefined);
        props.input.onChange(undefined);
    };
    return (
        <div className="flex-1 mb-3 w-100">
            <div className="flex items-center">
                <Label htmlFor={props.id} className="block mb-2 text-sm font-medium  dark:text-white">
                    {props.label}
                </Label>
                {props.hint && (
                    <span data-tooltip-target="tooltip-light" className="ml-1 mb-2">
                        <Tooltip className="z-50" content={`${props.hint}`}>
                            <IoInformationCircle size={16} className="text-gray-500" />
                        </Tooltip>
                    </span>
                )}
            </div>
            <div className="w-100">
                <FileInput {...props} onChange={handleSelectFile} accept={props.accept || 'image/*'} color={props.meta.error && props.meta.touched ? 'failure' : null} />
                <ValidationError props={props} />
            </div>
            <div className="my-4 flex border-2 border-dashed border-gray-300 rounded-xl justify-center p-1">
                {preview ? (
                    <img src={preview} className="flex-1 p-2  h-48 object-contain " width={props.width || 250} height={1} alt={props.label} />
                ) : (
                    <BiImageAdd className="flex-1 text-gray-200 h-48 p-8" />
                )}

                {preview && (
                    <Button color="failure" size={''} className=" text-white bg-red flex items-center cursor-pointer" onClick={handleRemoveFile}>
                        <MdClose size={18} />
                    </Button>
                )}
            </div>
        </div>
    );
}

export const wrapidQuill = ({ ...props }: any) => {
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    return (
        <div>
            <label htmlFor="">{props.label}</label>
            <div className="pt-5  space-y-8">
                <div className="grid">
                    {/*  With Tooltip */}
                    <div className="panel ">
                        <div className="mb-5">
                            <ReactQuill theme="snow" onChange={props.input.onChange} type="text" value={props.input.value} {...props} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface WrappedInputForUniqueNameProps {
    input: any;
    meta: any;
    label: string;
    type: string;
    placeholder: string;
    action: string;
}

export const WrappedInputForUniqueName: React.FC<WrappedInputForUniqueNameProps> = ({ input, meta, label, type, placeholder, action }) => {
    const [query, setQuery] = useState<string>(input.value);
    const [isUnique, setIsUnique] = useState<boolean>(true);

    useEffect(() => {
        const debouncedSearch = debounce(async () => {
            const response: any = await searchUniqueNameExist(query);
            setIsUnique(response.data.isUnique);
        }, 300);

        debouncedSearch();

        return () => {
            debouncedSearch.cancel(); // Cancel the debounce when component unmounts
        };
    }, [query]);
    return (
        <div>
            <label className="text-black">{label}</label>
            <div className="relative text-white-dark">
                <input
                    {...input}
                    disabled={action === 'updating' && true}
                    placeholder={placeholder}
                    className="form-input placeholder:text-white-dark"
                    value={input.value}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        input.onChange(e); // Propagate onChange event to Redux Form
                    }}
                />
            </div>
            {!isUnique && action !== 'updating' && <span className="text-red-500">This name is already taken.</span>}
            {meta.error && meta.touched && <span className="text-red-500">{meta.error}</span>}
        </div>
    );
};

interface IWrappedLocationProps extends FieldRenderProps<any, HTMLElement> {
    label: string;
}

export const WrappedLocation: React.FC<IWrappedLocationProps> = ({ input, meta, label, ...rest }) => {
    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    input.onChange({coordinates:[longitude, latitude] });
                },
                (error) => {
                    console.error('Error obtaining location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const longitude = parseFloat(e.target.value);
        const currentLatitude = input?.value?.coordinates?.[1] || 0;
        input.onChange({ coordinates: [longitude, currentLatitude] });
    };

    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const latitude = parseFloat(e.target.value);
        const currentLongitude = input?.value?.coordinates?.[0] || 0;
        input.onChange({ coordinates: [currentLongitude, latitude] });
    };

    return (
        <div>
            <label>{label}</label>
            <div className="flex flex-col gap-y-4">
                <div>
                    <input
                        className="mt-5"
                        type="number"
                        name="longitude"
                        placeholder="Longitude"
                        value={input?.value?.coordinates?.[0] || ''}
                        onChange={handleLongitudeChange}
                          {...rest}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        name="latitude"
                        placeholder="Latitude"
                        className="mb-4"
                        value={input.value?.coordinates?.[1] || ''}
                        onChange={handleLatitudeChange}
                        {...rest}
                    />
                </div>

                <button className=" bg-blue-400 px-2 py-1 text-white rounded-md" type="button" color="info" onClick={handleCurrentLocation}>
                    Use Current Location
                </button>
            </div>
            {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
    );
};


interface WrappedInputProps extends FieldRenderProps<string, HTMLElement> {
    label: string;
    placeholder?: string;
    type?: string;
  }
  
  export const wrappedOtp: React.FC<WrappedInputProps> = ({ label, placeholder, meta, input }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef<any[]>([]);
  
    const handleChange = (element: HTMLInputElement, index: number) => {
      if (/^\d$/.test(element.value) || element.value === '') {
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        input.onChange(newOtp.join(''));
  
        // Focus the next input
        if (element.value !== '' && index < 5) {
          inputsRef.current[index + 1].focus();
        }
      }
    };
  
    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
      if (event.key === 'Backspace' && otp[index] === '') {
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      }
    };
  
    const handlePaste = (event: React.ClipboardEvent) => {
      const pasteData = event.clipboardData.getData('text').slice(0, 6).split('');
      if (pasteData.every(char => /^\d$/.test(char))) {
        const newOtp = [...otp];
        pasteData.forEach((char, index) => {
          newOtp[index] = char;
        });
        setOtp(newOtp);
        input.onChange(newOtp.join(''));
        if (pasteData.length < 6) {
          inputsRef.current[pasteData.length].focus();
        } else {
          inputsRef.current[5].blur();
        }
      }
    };
  
    return (
      <div>
        <label className="text-black">{label}</label>
        <div className="flex space-x-2">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              ref={el => (inputsRef.current[index] = el)}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-10 text-center border border-gray-300 rounded"
            />
          ))}
        </div>
        {meta.error && meta.touched && <span className="text-red-500">{meta.error}</span>}
      </div>
    );
  };
  
 