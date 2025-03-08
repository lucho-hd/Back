import yup from "yup";

const subscriptionScheme = yup.object({
    name: yup.string()
        .required("El nombre de la suscripción es obligatorio")
        .min(4, "El nombre de la suscripción debe tener al menos 4 caracteres"),

    price: yup.number()
        .required("El precio de la suscripción es obligatorio")
        .positive("El precio debe ser un número positivo"),

    benefits: yup.array()
        .of(yup.string().required("Los beneficios de la suscripción no pueden quedar vacíos"))
        .min(1, "La suscripción debe tener al menos un beneficio")
        .required("Los beneficios de la suscripción son obligatorios")
}).noUnknown();

export {
    subscriptionScheme
}