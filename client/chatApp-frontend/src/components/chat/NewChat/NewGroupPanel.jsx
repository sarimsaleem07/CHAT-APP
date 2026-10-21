import { useState } from 'react'
import { Button, Input } from 'antd'
import { useFormik } from 'formik'
import { FiArrowRight, FiSearch, FiX } from 'react-icons/fi'
import SidePanel from '../../common/SidePanel/SidePanel'
import Avatar from '../../common/Avatar/Avatar'
import AvatarUpload from '../../common/AvatarUpload/AvatarUpload'
import ContactItem from './ContactItem'
import { filterContacts } from '../../../utils/contacts'
import { newGroupSchema } from '../../../validations/chatSchemas'
import { LIMITS } from '../../../validations/rules'
import '../../common/TextField/TextField.css'
import { ContactListSkeleton } from '../../common/Skeleton/Skeleton'
import './NewChat.css'

// Step 1: pick members → Step 2: name + photo
const NewGroupPanel = ({ contacts, loading, onBack, onCreate }) => {
  const [step, setStep] = useState(1)
  const [search, setSearch] = useState('')

  const formik = useFormik({
    initialValues: { members: [], name: '', photo: null },
    validationSchema: newGroupSchema,
    onSubmit: (values) => {
      const { name, members, photo } = newGroupSchema.cast(values)
      onCreate({ name, members, photo })
    },
  })

  const { values, errors, touched, setFieldValue, setFieldTouched } = formik
  const selected = values.members.map((id) => contacts.find((c) => c.id === id)).filter(Boolean)
  const results = filterContacts(contacts, search)

  const toggleMember = (id) => {
    const next = values.members.includes(id) ? values.members.filter((m) => m !== id) : [...values.members, id]
    setFieldValue('members', next)
  }

  const goNext = async () => {
    setFieldTouched('members', true, false)
    const errs = await formik.validateForm()
    if (!errs.members) setStep(2)
  }

  if (step === 1) {
    return (
      <SidePanel
        title="Add group members"
        onBack={onBack}
        footer={
          <div className="new-group__footer">
            <span className="new-group__count">
              {values.members.length} of {LIMITS.groupMembersMax} selected
            </span>
            <Button type="primary" size="large" icon={<FiArrowRight />} iconPlacement="end" onClick={goNext}>
              Next
            </Button>
          </div>
        }
      >
        {selected.length > 0 && (
          <div className="new-group__chips">
            {selected.map((c) => (
              <span key={c.id} className="member-chip">
                <Avatar name={c.name} src={c.avatar} color={c.color} size={24} />
                <span className="truncate">{c.name.split(' ')[0]}</span>
                <button type="button" onClick={() => toggleMember(c.id)} aria-label={`Remove ${c.name}`}>
                  <FiX />
                </button>
              </span>
            ))}
          </div>
        )}

        {touched.members && errors.members && <p className="new-group__error">{errors.members}</p>}

        <div className="new-chat__search">
          <Input
            variant="filled"
            prefix={<FiSearch className="new-chat__search-icon" />}
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={LIMITS.searchMax}
            allowClear
            autoFocus
          />
        </div>

        <div className="new-chat__list">
          {loading && <ContactListSkeleton />}
          {!loading &&
            results.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                selectable
                selected={values.members.includes(contact.id)}
                onClick={() => toggleMember(contact.id)}
              />
            ))}
          {!loading && results.length === 0 && <p className="new-chat__empty">No contacts found</p>}
        </div>
      </SidePanel>
    )
  }

  const nameError = touched.name && errors.name

  return (
    <SidePanel
      title="New group"
      onBack={() => setStep(1)}
      footer={
        <Button type="primary" size="large" block htmlType="submit" form="new-group-form">
          Create group
        </Button>
      }
    >
      <form id="new-group-form" className="new-group__form" onSubmit={formik.handleSubmit} noValidate>
        <AvatarUpload
          name={values.name}
          value={values.photo}
          onChange={(file) => {
            setFieldValue('photo', file)
            setFieldTouched('photo', true, false)
          }}
          error={errors.photo}
        />

        <div className="text-field">
          <label htmlFor="group-name" className="text-field__label">
            Group name
          </label>
          <Input
            id="group-name"
            name="name"
            placeholder="e.g. Frontend Team"
            value={values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={nameError ? 'error' : ''}
            maxLength={LIMITS.groupNameMax}
            showCount
            autoFocus
          />
          {nameError && <p className="text-field__error">{errors.name}</p>}
        </div>

        <div>
          <p className="text-field__label">Members · {selected.length}</p>
          <div className="new-group__chips new-group__chips--static">
            {selected.map((c) => (
              <span key={c.id} className="member-chip">
                <Avatar name={c.name} src={c.avatar} color={c.color} size={24} />
                <span className="truncate">{c.name.split(' ')[0]}</span>
              </span>
            ))}
          </div>
        </div>
      </form>
    </SidePanel>
  )
}

export default NewGroupPanel
