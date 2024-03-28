import * as Yup from "yup";

const UpdatePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Güncel şifreniz gereklidir."),
  newPassword: Yup.string()
    .required("Yeni şifreniz gereklidir.")
    .min(8, "Yeni şifreniz en az 8 karakter olmalıdır.")
    .matches(/[a-zA-Z]/, "Yeni şifre sadece Latin harflerini içerebilir."),
  newPasswordConfirm: Yup.string()
    .required("Yeni şifre tekrarı alanı gereklidir.")
    .oneOf([Yup.ref("newPassword"), null], "Şifreler eşleşmelidir."),
});

export default UpdatePasswordSchema;
