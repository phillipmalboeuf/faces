const Button = props => {
  return <button
    className={props.className}
    disabled={props.disabled ? true : false }
    onClick={(e)=> {
      e.currentTarget.blur()
      if (props.onClick) {props.onClick(e)}
    }}>{props.label}</button>
}