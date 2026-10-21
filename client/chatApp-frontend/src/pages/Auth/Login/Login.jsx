import { Button } from 'antd'
import { Formik, Form } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import AuthLayout from '../../../layout/AuthLayout/AuthLayout'
import TextField from '../../../components/common/TextField/TextField'
import { loginSchema } from '../../../validations/authSchemas'
import { LIMITS } from '../../../validations/rules'
import '../auth.css'

const initialValues = { email: '', password: '' }

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (values) => {
    const { email } = loginSchema.cast(values)
    // TODO: login API
    login({ name: email.split('@')[0], email })
    navigate('/')
  }

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <AuthLayout
          title="Welcome back"
          subtitle="Log in with your email and password to continue chatting."
          actions={
            <>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                form="login-form"
                className="auth-submit"
                loading={isSubmitting}
              >
                Log in
              </Button>
              <p className="auth-switch">
                Don’t have an account? <Link to="/signup">Sign up</Link>
              </p>
            </>
          }
          footer={
            <>
              By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </>
          }
        >
          <Form id="login-form" noValidate>
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
              placeholder="Enter your password"
              autoComplete="current-password"
              maxLength={LIMITS.passwordMax}
            />
            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form>
        </AuthLayout>
      )}
    </Formik>
  )
}

export default Login
