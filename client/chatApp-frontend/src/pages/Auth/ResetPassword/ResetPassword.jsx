import { useState } from 'react'
import { Button } from 'antd'
import { Formik, Form } from 'formik'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiKey } from 'react-icons/fi'
import AuthLayout from '../../../layout/AuthLayout/AuthLayout'
import TextField from '../../../components/common/TextField/TextField'
import PasswordHints from '../../../components/common/PasswordHints/PasswordHints'
import { resetPasswordSchema } from '../../../validations/authSchemas'
import { LIMITS } from '../../../validations/rules'
import '../auth.css'

const initialValues = { password: '', confirmPassword: '' }

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [done, setDone] = useState(false)

  const handleSubmit = async (values) => {
    // TODO: reset password API with `token` from the email link
    console.log({ token, password: values.password })
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout
        icon={<FiCheckCircle />}
        iconTone="success"
        title="Password updated"
        subtitle="Your password has been changed. You can now log in with your new password."
        actions={
          <Button type="primary" size="large" block className="auth-submit" onClick={() => navigate('/login')}>
            Log in
          </Button>
        }
      />
    )
  }

  return (
    <Formik initialValues={initialValues} validationSchema={resetPasswordSchema} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <AuthLayout
          icon={<FiKey />}
          title="Set a new password"
          subtitle="Choose a strong password you haven’t used before."
          onBack={() => navigate('/login')}
          actions={
            <>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                form="reset-form"
                className="auth-submit"
                loading={isSubmitting}
              >
                Reset password
              </Button>
              <p className="auth-switch">
                Back to <Link to="/login">Log in</Link>
              </p>
            </>
          }
        >
          <Form id="reset-form" noValidate>
            <TextField
              label="New password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              maxLength={LIMITS.passwordMax}
            />
            <PasswordHints password={values.password} confirmPassword={values.confirmPassword} />
            <TextField
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              maxLength={LIMITS.passwordMax}
            />
          </Form>
        </AuthLayout>
      )}
    </Formik>
  )
}

export default ResetPassword
