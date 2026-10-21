import { Button } from 'antd'
import { Formik, Form } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import AuthLayout from '../../../layout/AuthLayout/AuthLayout'
import TextField from '../../../components/common/TextField/TextField'
import PasswordHints from '../../../components/common/PasswordHints/PasswordHints'
import { signupSchema } from '../../../validations/authSchemas'
import { LIMITS } from '../../../validations/rules'
import '../auth.css'

const initialValues = { name: '', email: '', password: '', confirmPassword: '' }

const Signup = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (values) => {
    const { name, email } = signupSchema.cast(values)
    // TODO: signup API
    login({ name, email })
    navigate('/')
  }

  return (
    <Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <AuthLayout
          title="Create your account"
          subtitle="Just a few details and you’re ready to start chatting."
          onBack={() => navigate('/login')}
          actions={
            <>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                form="signup-form"
                className="auth-submit"
                loading={isSubmitting}
              >
                Create account
              </Button>
              <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </>
          }
          footer={
            <>
              By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </>
          }
        >
          <Form id="signup-form" noValidate>
            <TextField
              label="Full name"
              name="name"
              placeholder="Ali Khan"
              autoComplete="name"
              maxLength={LIMITS.nameMax}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={LIMITS.emailMax}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              maxLength={LIMITS.passwordMax}
            />
            <PasswordHints password={values.password} />
            <TextField
              label="Confirm password"
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

export default Signup
