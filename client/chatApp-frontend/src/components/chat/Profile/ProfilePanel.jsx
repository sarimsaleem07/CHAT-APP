import { App, Button } from 'antd'
import { Formik, Form } from 'formik'
import { FiLogOut, FiMail, FiMoon } from 'react-icons/fi'
import SidePanel from '../../common/SidePanel/SidePanel'
import AvatarUpload from '../../common/AvatarUpload/AvatarUpload'
import TextField from '../../common/TextField/TextField'
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle'
import { useAuth } from '../../../context/AuthContext'
import { profileSchema } from '../../../validations/userSchemas'
import { LIMITS } from '../../../validations/rules'
import { fileToDataUrl } from '../../../utils/file'
import './Profile.css'

const ProfilePanel = ({ onClose, onLogout }) => {
  const { message, modal } = App.useApp()
  const { user, updateUser } = useAuth()

  const initialValues = { photo: user?.avatar || null, name: user?.name || '', about: user?.about || '' }

  const handleSubmit = async (values, { resetForm }) => {
    const { name, about, photo } = profileSchema.cast(values)
    // TODO: update profile API (upload photo)
    const avatar = photo instanceof File ? await fileToDataUrl(photo) : photo
    updateUser({ name, about, avatar })
    resetForm({ values: { photo: avatar, name, about } })
    message.success('Profile updated')
  }

  const confirmLogout = () =>
    modal.confirm({
      title: 'Log out?',
      content: 'You will need to log in again to see your chats.',
      okText: 'Log out',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: onLogout,
    })

  return (
    <SidePanel title="Profile & settings" onBack={onClose}>
      <Formik initialValues={initialValues} validationSchema={profileSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, setFieldValue, setFieldTouched, dirty, isSubmitting, resetForm }) => (
          <Form className="profile__form" noValidate>
            <AvatarUpload
              name={values.name}
              value={values.photo}
              onChange={(file) => {
                setFieldValue('photo', file)
                setFieldTouched('photo', true, false)
              }}
              error={errors.photo}
              size={120}
            />

            <TextField
              label="Name"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              maxLength={LIMITS.nameMax}
            />
            <TextField
              label="About"
              name="about"
              type="textarea"
              placeholder="Hey there! I am using ChatApp"
              maxLength={LIMITS.aboutMax}
              showCount
              autoSize={{ minRows: 2, maxRows: 4 }}
            />

            <div className="text-field">
              <span className="text-field__label">Email</span>
              <div className="profile__readonly">
                <FiMail />
                <span className="truncate">{user?.email}</span>
              </div>
              <p className="profile__hint">Email can’t be changed.</p>
            </div>

            {dirty && (
              <div className="profile__actions">
                <Button onClick={() => resetForm()} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Save changes
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>

      <div className="profile__section">
        <p className="profile__section-title">Settings</p>
        <div className="profile__row">
          <span className="profile__row-icon">
            <FiMoon />
          </span>
          <span className="profile__row-label">Dark mode</span>
          <ThemeToggle />
        </div>
        <button type="button" className="profile__row profile__row--danger" onClick={confirmLogout}>
          <span className="profile__row-icon">
            <FiLogOut />
          </span>
          <span className="profile__row-label">Log out</span>
        </button>
      </div>
    </SidePanel>
  )
}

export default ProfilePanel
