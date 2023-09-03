import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import axios from 'axios';
import { FaRegTrashAlt } from 'react-icons/fa';

const { VITE_API_URL } = import.meta.env;

function TodoItem({ todos, toggleState, setToggleState, changeStatus, getTodos }) {
    //選單頁籤切換
    const chooseState = useMemo(() => {
        return(todos.filter( (item) => {
            if (toggleState == '全部') {
                return item;
            }
            else if (toggleState == '待完成') {
                return !item.status;
            }
            else if (toggleState == '已完成') {
                return item.status;
            }
        }));
    }, [todos]);

    // 刪除待辦事項
    const delTodoItem = async (e, id) => {
        e.preventDefault();

        try {
            await axios.delete(`${VITE_API_URL}/todos/${id}`);
            getTodos();
        } 
        catch (error) {
            Swal.showLoading();
            Swal.update({
                icon: 'error',
                title: '刪除事項失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
        }
        
    };

    //切換待辦事項狀態
    const toggleStatus = async (e, id) => {
        e.preventDefault();

        try {
            await axios.patch(`${VITE_API_URL}/todos/${id}/toggle`);
            getTodos();
        } 
        catch (error) {
            Swal.showLoading();
            Swal.update({
                icon: 'error',
                title: '更改狀態失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
        }
        
    };

    //清除所有已完成待辦事項
    const clearAllComplete = async (e) => {
        e.preventDefault();

        try {
            Swal.showLoading();
            const doneTodos = todos.filter(
                (todo) => todo.status && axios.delete(`${VITE_API_URL}/todos/${todo.id}`)
            );
            Swal.hideLoading();

            if (doneTodos.length == 0) {
                Swal.update({
                    icon: 'error',
                    title: '清除已完成事項錯誤',
                    text: '當前沒有已完成項目',
                    showConfirmButton: true
                });
                return;
            }
            
            await Promise.all(doneTodos);

            Swal.fire({
                icon: 'success',
                title: '清除已完成事項成功',
                text: '已完成清除',
                showConfirmButton: true
            });

            getTodos();

            //頁籤轉回已完成頁
            setToggleState('已完成');
        } 
        catch (error) {
            Swal.update({
                icon: 'error',
                title: '清除已完成事項失敗',
                text: error.response.data.message,
                showConfirmButton: true
            });
            Swal.hideLoading();
        }
      };

    return(
        <div className="todoList_list">
            <ul className="todoList_tab">
                <li className='changeBackgroundColor'>
                    <NavLink to='#' id='all' className={toggleState === '全部' ? 'choose' : ''} onClick={changeStatus}><p>全部</p></NavLink>
                </li>
                <li className='changeBackgroundColor'>
                    <NavLink to='#' id='pending' className={toggleState === '待完成' ? 'choose' : ''} onClick={changeStatus}><p>待完成</p></NavLink>
                </li>
                <li className='changeBackgroundColor'>
                    <NavLink to='#' id='done' className={toggleState === '已完成' ? 'choose' : ''} onClick={changeStatus}><p>已完成</p></NavLink>
                </li>
            </ul>
            <div className="todoList_items">
                <ul className="todoList_item">
                    {chooseState.map((todoItem) => {
                        return(
                            <li key={todoItem.id} className='changeBackgroundColor'>
                                <label className="todoList_label">
                                    <input className="todoList_input" type="checkbox" value={todoItem.status} checked={todoItem.status} onChange={(e) => toggleStatus(e, todoItem.id)} />
                                    <span>{todoItem.content}</span>
                                </label>
                                <NavLink to="#" onClick={(e) => delTodoItem(e, todoItem.id)}>
                                    <FaRegTrashAlt className='icon' />
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
                <div className="todoList_statistics">
                    <p> {todos.filter((item) => !item.status).length} 個待完成項目</p>
                    <NavLink to="#" className="formControls_btnLink" onClick={clearAllComplete}><p style={{ color: 'red' }}>清除已完成項目</p></NavLink>
                </div>
            </div>
        </div>
    )
}

TodoItem.propTypes = {
    toggleState: PropTypes.string,
    changeStatus: PropTypes.func,
    todos: PropTypes.array,
    getTodos: PropTypes.func
}

export default TodoItem;