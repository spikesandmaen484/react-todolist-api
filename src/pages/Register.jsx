import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import InputGroup from '../components/InputGroup';

const { VITE_API_URL } = import.meta.env;

function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState:{errors}, getValues } = useForm({
        defaultValues: {
            email: '',
            password: '',
            nickname: '',
            confirmPwd: ''
        },
        mode: 'onTouched'
    });

    const onSubmit = async(item) => {

        try {
            Swal.showLoading();
            const res = await axios.post(`${VITE_API_URL}/users/sign_up`, item);
            Swal.hideLoading();
            Swal.fire({
                icon: 'success',
                title: `註冊成功`,
                text: '即將前往登入頁面',
                showConfirmButton: false,
                timer: 2000,
            });
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } 
        catch (error) {
            Swal.update({
                icon: 'error',
                title: '註冊失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
        }
    }
    
    return(
        <div id="signUpPage" className="bg-yellow">
            <div className="conatiner signUpPage vhContainer">
                <div className="side">
                    <img className="d-m-n" src="https://github.com/spikesandmaen484/react-todolist-api/blob/main/src/img/wholePicture.png?raw=true" alt="workImg" />
                </div>
                <div>
                    <form className="formControls" action="index.html" onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="formControls_txt">註冊帳號</h2>

                        <InputGroup register={register} errors={errors} labelText='Email' labelClass='formControls_label' type="text" id="email" placeholder="請輸入 email" inputClass='formControls_input'  
                         rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: '信箱格式錯誤'
                            }
                         }} />

                        <InputGroup register={register} errors={errors} labelText='您的暱稱' labelClass='formControls_label' type="text" id="nickname" placeholder="請輸入您的暱稱" inputClass='formControls_input' 
                         rules={{ required: { value: true, message: '此欄位必填' } }} />

                        <InputGroup register={register} errors={errors} labelText='密碼' labelClass='formControls_label' type="password" id="password" placeholder="請輸入密碼" inputClass='formControls_input'
                         rules={{
                            required: { value: true, message: '此欄位必填' },
                            minLength: { value: 6, message: '密碼長度最少6碼' },
                            maxLength: { value: 20, message: '密碼長度最20碼' }
                        }}>
                        </InputGroup>

                        <InputGroup register={register} errors={errors} labelText='再次輸入密碼' labelClass='formControls_label' type="password" id="confirmPwd" placeholder="請再次輸入密碼" inputClass='formControls_input' 
                         rules={{
                            required: { value: true, message: '此欄位必填' },
                            validate: (val) => val === getValues('password') || '密碼與再次輸入密碼不相同',
                            minLength: { value: 6, message: '密碼長度最少6碼' },
                            maxLength: { value: 20, message: '密碼長度最20碼' }
                        }}>
                        </InputGroup>

                        <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
                        <NavLink to='/' className="formControls_btnLink"><p>登入</p></NavLink>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Register;