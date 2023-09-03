import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import InputGroup from '../components/InputGroup';
import axios from "axios";

const { VITE_API_URL } = import.meta.env;

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState:{errors} } = useForm({
        defaultValues: {
            email: '',
            password: ''    
        },
        mode: 'onTouched'
    });

    const login = async(data) => {
        
        try {
            Swal.showLoading();
            const res =  await axios.post(`${VITE_API_URL}/users/sign_in`, data);
            Swal.hideLoading();
            Swal.fire({
                icon: 'success',
                title: '登入成功',
                text: '即將前往待辦事項頁面',
                showConfirmButton: false,
                timer: 1000,
            });

            const {token, exp} = res.data;
            document.cookie = `token=${token};expires=${new Date(exp * 1000)}`;
            setTimeout(() => {
                navigate('/todolist');
            }, 2000);
        }    
        catch (error) {
            Swal.hideLoading();
            Swal.update({
                icon: 'error',
                title: '登入失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
        }
    }

    return(
        <div id="loginPage" className="bg-yellow">
            <div className="conatiner loginPage vhContainer ">
                <div className="side">
                    <img className="d-m-n" src="https://github.com/spikesandmaen484/react-todolist-api/tree/main/src/img/wholePicture.png" alt="workImg"></img>
                </div>
                <div>
                    <form className="formControls" action="" onSubmit={handleSubmit(login)}>
                        <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>

                        <InputGroup register={register} errors={errors} labelText='Email' labelClass='formControls_label' type="text" id="email" placeholder="請輸入 email" inputClass='formControls_input' 
                         rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: '信箱格式錯誤',
                            }
                         }} />

                        <InputGroup register={register} errors={errors} labelText='密碼' labelClass='formControls_label fw-bolder position-relative w-100' type="password" id="password" placeholder="請輸入密碼" inputClass='formControls_input' 
                         rules={{
                            required: { value: true, message: '此欄位必填' },
                            minLength: { value: 6, message: '密碼長度最少6碼' },
                            maxLength: { value: 20, message: '密碼長度最20碼' }
                        }}>
                        </InputGroup>

                        <input className="formControls_btnSubmit" type="submit" value="登入" />
                        <NavLink to='/Register' className="formControls_btnLink"><p>註冊帳號</p></NavLink>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;