import z from  "zod"


export const resetPasswordZodSchema =z.object({
  id:z.string({required_error:"Id is required"}),
  newPassword:z.string({required_error:"newPassword is required"}),
})
export const forgetPasswordZodSchema =z.object({
  email:z.string({required_error:"Email is required"}),
})