import { useEffect, useState } from 'react'

function ClientForm({ onAddClient, onUpdateClient, selectedClient }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    goal: '',
    status: 'active',
  })

  useEffect(() => {
    if (selectedClient) {
      setFormData(selectedClient)
    }
  }, [selectedClient])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (selectedClient) {
      onUpdateClient(formData)
    } else {
      const newClient = {
        clientId: crypto.randomUUID(),
        ...formData,
      }

      onAddClient(newClient)
    }

    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      goal: '',
      status: 'active',
    })
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <input
        name="lastName"
        placeholder="Last name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        name="goal"
        placeholder="Goal"
        value={formData.goal}
        onChange={handleChange}
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="inactive">Inactive</option>
      </select>

      <button type="submit">
        {selectedClient ? 'Update Client' : 'Save Client'}
      </button>
    </form>
  )
}

export default ClientForm