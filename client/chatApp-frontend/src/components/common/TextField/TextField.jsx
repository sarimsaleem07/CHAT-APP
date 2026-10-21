import { useField } from 'formik'
import { Input } from 'antd'
import './TextField.css'

const TextField = ({ label, name, type = 'text', ...props }) => {
  const [field, meta] = useField(name)
  const hasError = meta.touched && meta.error
  const InputComponent = type === 'password' ? Input.Password : type === 'textarea' ? Input.TextArea : Input

  return (
    <div className="text-field">
      <label htmlFor={name} className="text-field__label">
        {label}
      </label>
      <InputComponent
        id={name}
        type={type === 'textarea' ? undefined : type}
        status={hasError ? 'error' : ''}
        {...field}
        {...props}
      />
      {hasError && <p className="text-field__error">{meta.error}</p>}
    </div>
  )
}

export default TextField
