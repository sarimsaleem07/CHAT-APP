import * as Yup from 'yup'
import { aboutRule, imageFileRule, nameRule } from './rules'

export const profileSchema = Yup.object({
  photo: imageFileRule,
  name: nameRule,
  about: aboutRule,
})
