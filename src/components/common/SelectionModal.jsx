import ActionPills from './ActionPills'
import SearchBar from './SearchBar'

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

        <SearchBar
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={onSearchChange}
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