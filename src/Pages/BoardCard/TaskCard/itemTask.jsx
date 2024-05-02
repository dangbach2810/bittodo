import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { BASE_URL_IMAGE } from '../../../Contains/ConfigURL';
import { apiClient } from '../../../Services';
import { alertErrors, alertSuccess } from "../../../Contains/Config";
const ItemCard = (props) => {
    const { onChange, _i, i, handleRemoveTask, memberCard, isCheck } = props;
    const [isShowMember, setIsShowMember] = useState(false);
    const [oneMemberTask, setOneMemberTask] = useState("");

    useEffect(() => {
        apiClient.fetchApiGetTaskUserMenbers(i.id).then(res => {
            if (res.data) {
                setOneMemberTask(res.data);
            } else {
                // console.log("Fail.....")
            }
        })
    }, [])

    const handleRemoveTaskList = () => {
        if (isCheck) {
            handleRemoveTask(_i);
        }
        else {
            alertErrors("Thành viên không được phép xóa", 2000)
        }
    }

    const handleMemberTaskList = () => {
        setIsShowMember(true);
    }

    const handlTaskListMember = (user) => {
        console.log("Task:", i, "User:", user);
        if (oneMemberTask && oneMemberTask !== null) {
            apiClient.fetchApiDeleteTaskUserMenber(i.id, "fef5731b-9b86-4805-8717-2e01ed217515").then(res => {
                // console.log(res.data);
            })
        }
        apiClient.fetApiCreateTaskUserMenber(i.id, "fef5731b-9b86-4805-8717-2e01ed217515")
        setOneMemberTask(user);
    }


    return (
        <>
            <div className='footer-task d-flex task-drag-handle'>
                {isCheck ? <Checkbox
                    onChange={(e) => onChange(e, _i)}
                    checked={i.isActive}
                ></Checkbox>
                    :
                    <Checkbox
                        checked={i.isActive}
                    ></Checkbox>
                }

                <p className={`task-name ${i.isActive ? 'unline' : ''}`}>{i.name}</p>
                <div className='remove-task'>
                    <DeleteOutlined onClick={handleRemoveTaskList} />
                </div>
            </div>

        </>
    )
}

export default ItemCard;