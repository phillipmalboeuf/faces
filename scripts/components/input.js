const Input = props => {
  return <p>
    {props.label && <label htmlFor={props.name}>{props.label}</label>}
    <input id={props.name}
      className={props.className}
      name={props.name} 
      type={props.type ? props.type : 'text'}
      defaultValue={props.value}
      min={props.min}
      max={props.max}
      placeholder={props.placeholder}
      required={props.required ? true : false }
      autoFocus={props.autofocus ? true : false }
      onChange={props.onChange} />
  </p>
}