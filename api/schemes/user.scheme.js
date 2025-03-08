import yup from 'yup';

const userScheme = yup.object({
    name: yup.string()
        .required("El nombre es obligatorio"),

    surname: yup.string()
        .required("El apellido es obligatorio"),
        
    email: yup.string().email().required("El email es obligatorio"),

    password: yup.string()
        .min(5, "La contraseña debe tener al menos 5 caracteres")
        .required("La contraseña es obligatoria"),
}).noUnknown();

const userLoginScheme = yup.object({
    email: yup.string()
        .email().required("El email es obligatorio"),

    password: yup.string()
    .min(5, "La contraseña debe tener al menos 5 caracteres")
    .required("La contraseña es obligatoria"),
})

export {
    userScheme,
    userLoginScheme
}