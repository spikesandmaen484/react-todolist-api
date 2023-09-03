import { useNavigate, NavLink } from "react-router-dom";
import TodoItem from "./TodoItem";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useState } from 'react';
import axios from "axios";

const { VITE_API_URL } = import.meta.env;

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [toggleState, setToggleState] = useState('全部');
    const [nickname, setNickname] = useState("");
    const newTodo = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        checkLogin();
        getTodos();
    }, [toggleState]);

    // 驗證登入token並取得暱稱
    const checkLogin = async() => {
        try {
            const token = document.cookie.split('; ').find((row) => row.startsWith("token="))?.split('=')[1];
            axios.defaults.headers.common['Authorization'] = token;

            const response = await axios.get(`${VITE_API_URL}/users/checkout`, {
                headers: {
                    Authorization: token
                }
            });

            setNickname(response.data.nickname);
            getTodos();
        } 
        catch (error) {
            Swal.showLoading();console.log(error);
            Swal.update({
                icon: 'error',
                title: '登入驗證失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
            navigate('/');
        }
	};

    //登出
    const logOut = async(e) => {
        e.preventDefault();

        try {
            Swal.showLoading();
            const res = await axios.post(`${VITE_API_URL}/users/sign_out`);
            document.cookie = `token=';expires=${new Date()}`;
            
            Swal.fire({
                icon: 'success',
                title: '登出成功',
                text: '',
                showConfirmButton: true
            });
            Swal.hideLoading();
            navigate('/');
        } 
        catch (error) {
            Swal.update({
                icon: 'error',
                title: '登出失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
        }
    }

    //取得待辦事項
    const getTodos = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/todos`);
            setTodos(response.data.data);
        } 
        catch (error) {
            Swal.showLoading();
            Swal.update({
                icon: 'error',
                title: '取待辦事項失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
        }
    };

    //新增待辦事項
    const addTodo = async (e) => {
        e.preventDefault();
        
        try {
            Swal.showLoading();
            if (newTodo.current.value.trim() == '') {
                Swal.hideLoading();
                Swal.update({
                    icon: 'error',
                    title: '新增的待辦事項不能空白',
                    text: '',
                    showConfirmButton: true
                });
                return;
            }

            await axios.post(`${VITE_API_URL}/todos`, {
                content: newTodo.current.value
            });
            Swal.hideLoading();

            Swal.fire({
                icon: 'success',
                title: '新增待辦事項成功',
                text: '',
                showConfirmButton: true
            });
            
            newTodo.current.value = '';
            getTodos();

            //頁籤轉回全部頁
            setToggleState('全部');
        } 
        catch (error) {
            Swal.showLoading();
            Swal.update({
                icon: 'error',
                title: '新增待辦事項失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
        }
        
    };

    //變更頁籤內容
    const changeStatus = ((e) => {
        e.preventDefault();
        setToggleState(e.target.textContent);
    });

    
    
    return(
        <div id="todoListPage" className="bg-half">
            <nav>
                <h1><NavLink to="#">ONLINE TODO LIST</NavLink></h1>
                <ul>
                    <li className="todo_sm"><NavLink to="/todolist" className="formControls_btnLink"><p>{nickname}的代辦</p></NavLink></li>&nbsp;&nbsp;
                    <li><NavLink className="formControls_btnLink" onClick={logOut}><p>登出</p></NavLink></li>
                </ul>
            </nav>
            <div className="conatiner todoListPage vhContainer">
                <div className="todoList_Content">
                    <div className="inputBox">
                        <input type="text" placeholder="請輸入待辦事項" ref={newTodo} />
                        <NavLink to="#" className="formControls_btnLink" onClick={addTodo}>
                            <i className="fa fa-plus"></i>
                        </NavLink>
                    </div>
                    {todos.length === 0 ? (<div className="empty"><p align="center">目前尚無待辦事項</p>
                    <img src='https://github.com/spikesandmaen484/react-todolist-api/blob/main/src/img/person.png?raw=true' alt='目前尚無待辦事項' /></div>)
                      : (
                            <TodoItem todos={todos} toggleState={toggleState} setToggleState={setToggleState} changeStatus={changeStatus} getTodos={getTodos} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default TodoList;