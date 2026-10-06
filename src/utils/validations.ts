import * as yup from "yup";

// Reusable field schemas
const email = yup
  .string()
  .trim()
  .required("El correo electrónico es requerido.")
  .email("El correo electrónico es inválido.");

const password = yup
  .string()
  .required("La contraseña es requerida.")
  .min(6, "La contraseña debe tener al menos 6 caracteres.")
  .matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "La contraseña debe contener al menos una mayúscula, una minúscula y un número."
  );

const firstName = yup
  .string()
  .trim()
  .required("Tu nombre es requerido.")
  .min(2, "Tu nombre debe tener al menos 2 caracteres.");

const lastName = yup
  .string()
  .trim()
  .required("Tu apellido es requerido.")
  .min(2, "Tu apellido debe tener al menos 2 caracteres.");

// Form schemas
export const signInSchema = yup.object({
  email,
  password: yup.string().required("La contraseña es requerida."),
});

export const signUpSchema = yup.object({
  firstName,
  lastName,
  email,
  password,
  confirmPassword: yup
    .string()
    .required("Por favor, confirma tu contraseña.")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden."),
});

export const restorePasswordSchema = yup.object({
  email,
});

export const editProfileSchema = yup.object({
  firstName,
  lastName,
});

export const bankAccountSchema = yup.object({
  bank: yup
    .string()
    .trim()
    .required("El nombre del banco es requerido.")
    .min(2, "El nombre del banco debe tener al menos 2 caracteres."),
  cc: yup
    .string()
    .trim()
    .required("El número de cuenta (CC) es requerido.")
    .min(5, "El número de cuenta debe tener al menos 5 caracteres."),
  cci: yup
    .string()
    .trim()
    .required("El CCI es requerido.")
    .min(5, "El CCI debe tener al menos 5 caracteres."),
});

// Types inferred from schemas
export type SignInFormData = yup.InferType<typeof signInSchema>;
export type SignUpFormData = yup.InferType<typeof signUpSchema>;
export type RestorePasswordFormData = yup.InferType<typeof restorePasswordSchema>;
export type BankAccountFormData = yup.InferType<typeof bankAccountSchema>;
export type EditProfileFormData = yup.InferType<typeof editProfileSchema>;

// Helper function to validate and get errors
export async function validateForm<T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<{ isValid: boolean; errors: Record<string, string> }> {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path && !errors[error.path]) {
          errors[error.path] = error.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Error de validación" } };
  }
}
