import * as Yup from 'yup'
import { attachmentRule, composerTextRule, groupMembersRule, groupNameRule, imageFileRule } from './rules'

export const newGroupSchema = Yup.object({
  members: groupMembersRule,
  name: groupNameRule,
  photo: imageFileRule,
})

export const composerSchema = Yup.object({
  attachment: attachmentRule,
  text: composerTextRule,
})
