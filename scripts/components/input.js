


const Input = props => {
  
  if (props.type == "hidden") {
    return <input name={props.name} id={props.name} 
      type={props.type}
      defaultValue={props.value}
      onChange={props.onChange} />
  } else if (props.type == "readonly") {
    return [
      props.label && <label key="label" htmlFor={props.name}>{props.label}</label>,
      <input key="input" name={props.name} id={props.name} 
        type="hidden"
        defaultValue={props.value}
        onChange={props.onChange} />,
      <p key="text" className="input">{props.text}</p>
    ]
  } else if (props.type == "textarea") {
    return [
      props.label && <label key="label" htmlFor={props.name}>{props.label}</label>,
      <textarea key="input" name={props.name} id={`${props.name}`} 
        defaultValue={props.value}
        placeholder={props.placeholder}
        required={props.required ? true : false}
        onChange={props.onChange} />
    ]
  } else if (props.type == "checkbox") {
    return [
      <input key="input" name={props.name} id={`${props.name}_${props.value}`} 
        className={props.pill ? "checkbox--pill" : null}
        type={props.type}
        defaultValue={props.value}
        defaultChecked={props.checked}
        required={props.required ? true : false}
        onChange={props.onChange} />,
      props.label && <label key="label" htmlFor={`${props.name}_${props.value}`}>{props.label}</label>
    ]
  } else if (props.type == "select") {
    return [
      props.label && <label key="label" htmlFor={props.name}>{props.label}</label>,
      <select key="input" name={props.name} id={props.name} defaultValue={props.value ? props.value : props.multiple ? [] : null}
        multiple={props.multiple ? true : false}
        size={props.multiple ? props.options.length : null}
        onChange={props.onChange}>
        {props.optional && <option value={undefined}>{props.placeholder}</option>}
        {props.options.map((option)=> {
          if (option.value != undefined) {
            return <option key={option.value} value={option.value}>{option.label}</option>    
          } else {
            return <option key={option} value={option}>{option}</option>
          }
        })}
      </select>
    ]
  } else {
    return [
      props.label && <label key="label" htmlFor={props.name}>{props.label}{props.optional ? " (Optional)" : "" }</label>,
      <input key="input" name={props.name} id={props.name} className={`${props.inline ? " input--inline" : null}`}
        type={props.type ? props.type : 'text'}
        defaultValue={props.type == "date" && props.value ? props.value.split("T")[0] : props.value}
        placeholder={props.placeholder}
        required={props.optional ? false : true}
        disabled={props.disabled ? true : false}
        autoFocus={props.autoFocus ? true : false}
        autoComplete={props.type == "password" && props.new ? "new-password" : props.type == "search" ? "off" : null}
        step={props.type == "number" ? "any" : null}
        onChange={props.onChange} />
    ]
  }

    
}