import ActionPills from '../common/ActionPills'
import useTranslations from '../../hooks/useTranslations'

function ClientDetailsSection({
  formData,
  activeSection,
  onToggleSection,
  onChange,
  onSubmit,
  onCancelEdit,
  saveLabel,
}) {
  const { t } = useTranslations()

  return (
    <div
      className="profile-summary clickable-summary"
      onClick={() => onToggleSection('details')}
    >
      <div className="section-header clickable-section-header">
        <h4>{t('client')}</h4>
      </div>

      <p>
        <strong>{t('client')}:</strong>{' '}
        {formData.firstName} {formData.lastName}
      </p>

      {formData.phone && (
        <p>
          <strong>{t('phone')}:</strong> {formData.phone}
        </p>
      )}

      {formData.goal && (
        <p>
          <strong>{t('goal')}:</strong> {formData.goal}
        </p>
      )}

      <p>
        <strong>{t('status')}:</strong> {t(formData.status)}
      </p>

      {activeSection === 'details' && (
        <form
          className="client-form section-content"
          onSubmit={onSubmit}
          onClick={(event) => event.stopPropagation()}
        >
          <input
            name="firstName"
            placeholder={t('firstName')}
            value={formData.firstName}
            onChange={onChange}
            required
          />

          <input
            name="lastName"
            placeholder={t('lastName')}
            value={formData.lastName}
            onChange={onChange}
            required
          />

          <input
            name="phone"
            placeholder={t('phone')}
            value={formData.phone}
            onChange={onChange}
          />

          <input
            name="goal"
            placeholder={t('goal')}
            value={formData.goal}
            onChange={onChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={onChange}
          >
            <option value="active">{t('active')}</option>
            <option value="paused">{t('paused')}</option>
            <option value="inactive">{t('inactive')}</option>
          </select>

          <ActionPills
            onCancel={onCancelEdit}
            cancelLabel={t('cancel')}
            saveLabel={saveLabel || t('update')}
          />
        </form>
      )}
    </div>
  )
}

export default ClientDetailsSection