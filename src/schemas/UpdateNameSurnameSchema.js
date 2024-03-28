import * as Yup from "yup";

const UpdateNameSurnameSchema = Yup.object().shape({
  firstName: Yup.string().required("Adınız gereklidir."),
  lastName: Yup.string().required("Soyadınız gereklidir."),
});

export default UpdateNameSurnameSchema;
