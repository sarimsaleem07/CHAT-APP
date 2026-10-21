import * as Yup from 'yup'
import { confirmPasswordRule, emailRule, loginPasswordRule, nameRule, newPasswordRule } from './rules'

export const loginSchema = Yup.object({
  email: emailRule,
  password: loginPasswordRule,
})

export const signupSchema = Yup.object({
  name: nameRule,
  email: emailRule,
  password: newPasswordRule,
  confirmPassword: confirmPasswordRule('password'),
})

export const forgotPasswordSchema = Yup.object({
  email: emailRule,
})

export const resetPasswordSchema = Yup.object({
  password: newPasswordRule.label('New password'),
  confirmPassword: confirmPasswordRule('password'),
})
