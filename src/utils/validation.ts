export const validation_required = (value: string | number | undefined) => {
    if (typeof value == "number") {
      return value != null && value != undefined ? undefined : "Required";
    } else {
      return value ? undefined : "Required";
    }
  };

  export const password_check =(values:any) =>{
    if(values?.newPassword == values.reEnterPassword){
      return undefined
    }else{
      return 'Password does not match!'
    }
  }
  export const validation_email = (value: any) => {
    if (value && value.match(/^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/)) {
      return undefined;
    }
    return "Invalid email address";
  };
  

  export const shop_validate_file_upload = (file:any) => {
    if (!file) {
      return 'Please upload shop image';
  }
    // Define allowed file types
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg', 'image/gif'];
    // Define max file size (in bytes)

    // Check if file type is allowed
    if (!allowedTypes.includes(file.type)) {
        return 'File type not allowed. Please upload a JPEG, PNG, JPG or GIF file.';
    }
    // Validation passed
    return null;
};

export const validation_phone = (value: any) => {
  if (value && value.match(/^\+?\d{1,4}?[-.\s]?(\(?\d{1,3}?\)?[-.\s]?)?\d{9,}$/)) {
      return undefined;
  }
  return "Invalid phone number";
};
