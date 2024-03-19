import * as Yup from 'yup';

const ContinueRegisterUserSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required('Telefon numarası girmeniz gereklidir.')
    .matches(/^5\d{9}$/, 'Lütfen geçerli bir telefon numarası giriniz.')
    .min(10, 'Telefon numaranız 10 karakter olmalıdır.')
    .max(10, 'Telefon numaranız 10 karakter olmalıdır.'),
  birthDate: Yup.date()
    .required('Doğum tarihinizi giriniz')
    .max(new Date(), 'Geçerli bir doğum tarihi giriniz'),
  userName: Yup.string()
    .required('Kullanıcı adınızı girmeniz gereklidir.')
    .min(2, 'Kullanıcı adınızı en az 2 karakter olmalıdır.')
    .max(50, 'Kullanıcı adınızı en fazla 50 karakter olmalıdır.'),
});

export default ContinueRegisterUserSchema;