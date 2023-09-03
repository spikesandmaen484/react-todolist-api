const InputGroup = ({ register, errors, labelText, labelClass, type, id, inputClass, rules, placeholder
}) => {
    return (
        <>
            <label htmlFor={id} className={labelClass}>
                {labelText}
            </label>
            <input
                type={type}
                id={id}
                className={`${inputClass} ${errors?.[id]?.message ? 'is-invalid' : ''}`}
                {...register(id, rules)}
                placeholder={placeholder}
            />
            {errors?.[id]?.message ? <span className='invalid-feedback'>{errors?.[id]?.message}</span> : null}
        </>
    );
};
export default InputGroup;