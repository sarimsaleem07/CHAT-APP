import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { Formik, Form } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { FiLock, FiMail } from 'react-icons/fi'
import AuthLayout from '../../../layout/AuthLayout/AuthLayout'
import TextField from '../../../components/common/TextField/TextField'
import { forgotPasswordSchema } from '../../../validations/authSchemas'
import { LIMITS } from '../../../validations/rules'
import '../auth.css'

const RESEND_SECONDS = 60

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [sentTo, setSentTo] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const sendLink = (email) => {
    // TODO: forgot password API
    setSentTo(email)
    setSecondsLeft(RESEND_SECONDS)
  }

  if (sentTo) {
    return (
      <AuthLayout
        icon={<FiMail />}
        title="Check your email"
        subtitle={
          <>
            We sent a password reset link to <span className="auth-subtitle-email">{sentTo}</span>. Open it to set a new
            password.
          </>
        }
        onBack={() => setSentTo('')}
        actions={
          <>
            <Button type="primary" size="large" block className="auth-submit" onClick={() => navigate('/login')}>
              Back to log in
            </Button>
            <Button size="large" block onClick={() => setSentTo('')}>
              Use a different email
            </Button>
          </>
        }
      >
        <p className="auth-resend">
          Didn’t get it? Check your spam folder or{' '}
          {secondsLeft > 0 ? (
            <>
              resend in <strong>00:{String(secondsLeft).padStart(2, '0')}</strong>
            </>
          ) : (
            <button type="button" className="auth-link-btn" onClick={() => sendLink(sentTo)}>
              resend link
            </button>
          )}
        </p>
      </AuthLayout>
    )
  }

  return (
    <Formik
      initialValues={{ email: sentTo }}
      validationSchema={forgotPasswordSchema}
      onSubmit={async (values) => sendLink(forgotPasswordSchema.cast(values).email)}
    >
      {({ isSubmitting }) => (
        <AuthLayout
          icon={<FiLock />}
          title="Forgot password?"
          subtitle="No worries. Enter the email you signed up with and we’ll send you a reset link."
          onBack={() => navigate('/login')}
          actions={
            <>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                form="forgot-form"
                className="auth-submit"
                loading={isSubmitting}
              >
                Send reset link
              </Button>
              <p className="auth-switch">
                Remember your password? <Link to="/login">Log in</Link>
              </p>
            </>
          }
        >
          <Form id="forgot-form" noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={LIMITS.emailMax}
            />
          </Form>
        </AuthLayout>
      )}
    </Formik>
  )
}

export default ForgotPassword
