function AddRow({
  label,
  onClick,
  type = 'button',
  prefix = '+',
}) {
  return (
    <div className="add-row">
      <button
        type={type}
        className="add-row-button"
        onClick={onClick}
      >
        {prefix && `${prefix} `}
        {label}
      </button>
    </div>
  )
}

export default AddRow