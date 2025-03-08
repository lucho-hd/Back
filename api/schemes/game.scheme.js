import yup from 'yup';

const gameScheme = yup.object({
    title: yup.string()
        .required("El título es obligatorio")
        .max(100, "El título no puede tener más de 100 caracteres"),

    price: yup.number()
        .required("El precio es obligatorio")
        .positive("El precio debe ser un número positivo"),

    release_date: yup.string()
        .required("La fecha es obligatoria")
        .typeError("La fecha debe estar en un formato válido (YYYY-MM-DD)"),

    cover_description: yup.string()
        .required("La descripción de la imagen es obligatoria")
        .max(250, "La descripción de la imagen no puede tener más de 250 caracteres"),

    description: yup.string()
        .required("La descripción del juego es obligatoria")
        .min(20, "La descripción del juego debe tener al menos 20 caracteres"),

    company: yup.string()
        .required("La compañía es obligatoria")
        .max(50, "El nombre de la compañia no puede exceder los 50 caracteres"),

    genres: yup.array()
        .of(yup.string().required("El género no puede quedar vacío"))
        .min(1, "El juego debe tener al menos un género")
        .required("El género del juego es obligatorio"),

    plataforms: yup.array()
        .of(yup.string().required("La plataforma no puede quedar vacía"))
        .min(1, "El juego debe tener al menos una plataforma")
        .required("La plataforma es obligatoria")
}).noUnknown();

export {
    gameScheme
}