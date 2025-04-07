import './index.scss'
import logo from '/src/assets/qavoCodesLogo.png'
import {useFormik} from 'formik';
import Swal from "sweetalert2";
import {useState} from "react";
import {ThreeCircles} from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {Helmet} from "react-helmet-async";
import {usePostAdminLoginMutation} from "../../../services/userApi.jsx";

function AdminLogin() {

    const [postUserLogin] = usePostAdminLoginMutation()
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values, {resetForm}) => {
            try {
                setLoading(true);
                const response = await postUserLogin(values).unwrap();

                if (response?.statusCode === 200) {
                    await Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Giriş uğurludur!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    resetForm()
                    navigate('/cp/dashboard/portfolio')
                    Cookies.set("qavoCodesToken", response?.data?.token)
                }
            } catch (error) {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Email və ya şifrə yanlışdır!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            setLoading(false);
        },
    });

    return (
        <section id={"adminLogin"}>
            <Helmet>
                <title>Admin - Giriş</title>
            </Helmet>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={"img"}>
                                <img src={logo} alt={"Logo"}/>
                            </div>
                            <div className={"line"}></div>
                            <h2>Admin panelə giriş</h2>
                            <div className={"lineWrapper"}>
                                <div className={"greenLine"}></div>
                            </div>
                            <input
                                placeholder={"E-mail"}
                                name={"email"}
                                type={"email"}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            <input
                                placeholder={"Şifrə"}
                                name={"password"}
                                type={"password"}
                                onChange={formik.handleChange}
                                value={formik.values.password}
                            />
                            <button type="submit">
                                {!loading ? 'Daxil ol' :
                                    <ThreeCircles className={"buttonColor"} color={'#454545'} height={'25'}/>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminLogin;