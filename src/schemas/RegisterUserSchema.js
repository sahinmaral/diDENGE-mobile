import * as Yup from 'yup';

const RegisterUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('İsim girmeniz gereklidir.')
    .min(2, 'İsim en az 2 karakter olmalıdır.')
    .max(30, 'İsim en fazla 30 karakter olmalıdır.'),
  lastName: Yup.string()
    .required('Soyisim girmeniz gereklidir.')
    .min(2, 'Soyisim en az 2 karakter olmalıdır.')
    .max(30, 'Soyisim en fazla 30 karakter olmalıdır.'),
  email: Yup.string()
    .required('E-posta alanı gereklidir.')
    .email('Geçerli bir e-posta adresi giriniz.'),
  password: Yup.string()
    .required('Şifre alanı gereklidir.')
    .min(8, 'Şifre en az 8 karakter olmalıdır.')
    .matches(/[a-zA-Z]/, 'Şifre sadece Latin harflerini içerebilir.'),
  passwordConfirm: Yup.string()
    .required('Şifre tekrarı alanı gereklidir.')
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmelidir.'),
});


export default RegisterUserSchema;