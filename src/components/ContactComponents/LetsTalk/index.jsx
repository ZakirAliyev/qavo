import './index.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PulseLoader} from "react-spinners";

function LetsTalk() {
    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            description: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Adınızı daxil edin'),
            surname: Yup.string()
                .required('Soyadınızı daxil edin'),
            email: Yup.string()
                .email('Düzgün elektron poçt daxil edin')
                .required('Elektron poçtunuzu daxil edin'),
            phoneNumber: Yup.string()
                .matches(/^\+?\d{10,15}$/, 'Düzgün telefon nömrəsi daxil edin')
                .required('Telefon nömrənizi daxil edin'),
            description: Yup.string()
                .required('Təsvirinizi daxil edin')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await fetch('https://api.qavo.az/api/Contact/create-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const result = await response.json();

                if (result?.statusCode === 201) {
                    toast.success('Mesajınız uğurla göndərildi!', {
                        position: 'bottom-left',
                        autoClose: 2000,
                        theme: 'dark',
                    });
                    resetForm();
                } else {
                    toast.error('Mesaj göndərilərkən xəta baş verdi.', {
                        position: 'bottom-left',
                        autoClose: 2000,
                        theme: 'dark',
                    });
                }
            } catch (error) {
                toast.error('Şəbəkə xətası: Mesaj göndərilə bilmədi.', {
                    position: 'bottom-left',
                    autoClose: 2000,
                    theme: 'dark',
                });
            }
        }
    });

    return (
        <section id="letsTalk">
            <div className="container6">
                <div className="text">BİZƏ GÖNDƏR</div>
                <div className="row">
                    <div className="box col-6 col-md-6 col-sm-12 col-xs-12">
                        <input
                            type="text"
                            name="name"
                            placeholder="Adın nədir"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="error">{formik.errors.name}</div>
                        ) : null}
                    </div>
                    <div className="box1 col-6 col-md-6 col-sm-12 col-xs-12">
                        <input
                            type="text"
                            name="surname"
                            placeholder="Soyadın nədir"
                            value={formik.values.surname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.surname && formik.errors.surname ? (
                            <div className="error">{formik.errors.surname}</div>
                        ) : null}
                    </div>
                </div>
                <div className="iki row diki">
                    <div className="box col-6 col-md-6 col-sm-12 col-xs-12">
                        <input
                            type="email"
                            name="email"
                            placeholder="Sənin elektron poçtun"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div className="box1 col-6 col-md-6 col-sm-12 col-xs-12">
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Telefon nömrən"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                            <div className="error">{formik.errors.phoneNumber}</div>
                        ) : null}
                    </div>
                </div>
                <div className="iki row">
                    <div className="col-12 col-md-12 col-sm-12 col-xs-12">
                        <textarea
                            name="description"
                            placeholder="Bizə proyektin haqqında danış"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className="error">{formik.errors.description}</div>
                        ) : null}
                    </div>
                </div>
                <div className="buttonWrapper">
                    <button
                        type="button"
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting}
                        style={{ color: formik.isSubmitting ? 'white' : '' }}
                    >
                        {formik.isSubmitting ? <PulseLoader color={"white"} size={8}/> : 'GÖNDƏR'}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
}

export default LetsTalk;