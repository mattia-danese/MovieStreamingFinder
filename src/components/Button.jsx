export const Button = ( props ) => {
    return (
        <button type={props.type} onClick={props.handleOnClick} disabled={props.disabled} className={props.styles}>
            {props.message}
        </button>
    )
}