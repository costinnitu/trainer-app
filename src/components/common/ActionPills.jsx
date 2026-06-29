function ActionPills({
  onCancel,
  onSave,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  saveType = 'submit',
  disabled = false,
}) {
  const isCustomSave = typeof onSave === 'function'

  return (
    <div className="form-actions pill-actions">
      <button
        type="button"
        className="add-row-button"
        onClick={onCancel}
        disabled={disabled}
      >
        {cancelLabel}
      </button>

      <button
        type={isCustomSave ? 'button' : saveType}
        className="add-row-button"
        onClick={onSave}
        disabled={disabled}
      >
        {saveLabel}
      </button>
    </div>
  )
}

export default ActionPills