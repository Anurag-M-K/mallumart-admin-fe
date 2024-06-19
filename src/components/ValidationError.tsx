function ValidationError({ props }: any) {
    return (
      <>
        {((props.meta.error && props.meta.touched) || props.error) && (
          <span className="mt-2 text-sm text-red-600 dark:text-red-500">
            {props.meta.error ?? props.error}
          </span>
        )}
      </>
    );
  }
  
  export default ValidationError;
  