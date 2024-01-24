// const userCoreSchema = z.object({
//   ...userCore,
// });
// const isPasswordMatch = {
//   validate: function (data: any) {
//     return data.password === data.passwordConfirm;
//   },
//   errorMessage: function (schema: any, parentSchema: any, data: any) {
//     return `Passwords do not match`;
//   },
// };

// ----- USER

// const userCoreSchema = {
//   $id: "userCoreSchema",
//   type: "object",
//   properties: {
//     name: { type: "string", minLength: 3, maxLength: 255 },
//     email: {
//       type: "string",
//       format: "email",
//     },
//     role: { enum: Object.values(Role), type: "string" },
//     active: { type: "boolean" },
//     activated: { type: "boolean" },
//   },
//   required: ["name", "email"],
// };

// const passwordSchema = {
//   $id: "passwordSchema",
//   type: "object",
//   properties: {
//     password: { type: "string", minLength: 8, maxLength: 255 },
//     passwordConfirm: { type: "string" },
//   },
//   required: ["password", "passwordConfirm"],
//   validator: [isPasswordMatch],
// };

// export const userResponceSchema = {
//   $id: "userResponceSchema",
//   type: "object",
//   properties: {
//     // id: { type: "number" },
//     name: { type: "string" },
//     // ...userCoreSchema.properties, // properties
//   },
//   // required: ["name"],
// };

// const createUserSchema = {
//   $id: "createUserSchema",
//   type: "object",
//   properties: {
//     ...userCoreSchema.properties,
//     ...passwordSchema.properties,
//   },
//   required: [...userCoreSchema.required, ...passwordSchema.required],
//   validator: [...passwordSchema.validator],
// };

// const updateUserSchema = {
//   $id: "updateUserSchema",
//   type: "object",
//   properties: {
//     ...userCoreSchema.properties,
//   },
//   required: [],
// };

// -------- AUTH

// export const userSchemas = [
//   userCoreSchema,
//   createUserSchema,
//   updateUserSchema,
//   userResponceSchema,
//   passwordSchema,
// ];
