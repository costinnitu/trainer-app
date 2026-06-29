import ActionPills from './ActionPills'

function SelectionModal({
  title,
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  items,
  renderItem,
  onClose,
  saveLabel,
  showSave = true,
}) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{title}</h3>

        <input
          className="search-input"
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <div className="client-list">
          {items.map(renderItem)}
        </div>

        <ActionPills
          onCancel={onClose}
          onSave={showSave ? onClose : undefined}
          cancelLabel="Cancel"
          saveLabel={saveLabel || 'Update'}
        />
      </div>
    </div>
  )
}

export default SelectionModal