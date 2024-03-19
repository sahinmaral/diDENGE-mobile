import * as Yup from 'yup';

const LoginUserSchema = Yup.object().shape({
  email: Yup.string()
    .required('E-posta gereklidir.')
    .email('Geçerli bir e-posta adresi giriniz.'),
  password: Yup.string()
    .required('Şifre gereklidir.')
});


export default LoginUserSchema;