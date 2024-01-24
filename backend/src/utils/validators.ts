import addFormats from "ajv-formats";
// import { userResponceSchema, userSchemas } from "../modules/user/user.schema";

const Ajv = require("ajv");

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
});

addFormats(ajv);

export interface SchemaValidator {
  validate: (data: any) => boolean;
  errorMessage: (schema: any, parentSchema: any, data: any) => string;
}

export interface Validator {
  (data: any): boolean;
  errors: any[];
}

ajv.addKeyword("validator", {
  compile: (schema: [SchemaValidator], parentSchema: any) => {
    const validator: Validator = function validate(data) {
      let valid = true;
      if (
        // check if the schema is an array of objects
        typeof schema === "object" &&
        Array.isArray(schema) &&
        schema.every((f) => typeof f === "object")
      ) {
        // handle each custom validator
        schema.forEach((v) => {
          valid = v.validate(data);
          if (!valid) {
            validator.errors = [
              {
                keyword: "validate",
                message: ": " + v.errorMessage(schema, parentSchema, data),
                params: { keyword: "validate" },
              },
            ];
            return valid;
          }
        });
      } else {
        throw new Error("Invalid definition for custom validator");
      }
      return valid;
    };
    validator.errors = [];
    return validator;
  },
});

// userSchemas.forEach((schema) => {
//   ajv.addSchema(schema, schema.$id);
// });

module.exports = ajv.compile.bind(ajv);
