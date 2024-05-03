import { Input, Button, Modal, Progress, Checkbox } from 'antd';
import { PlusCircleOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import TextArea from 'antd/lib/input/TextArea';
import { useState, useEffect, useRef } from 'react';
import './style.scss';
import TaskCard from '../TaskCard';
import { applyDrag } from '../../../Utils/dragDrop';
import { apiClient } from '../../../Services';
import NotFound from '../../NotFound';
import { mapOrderCol } from '../../../Utils/sort';
import { alertErrors, alertSuccess } from "../../../Contains/Config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from "lodash";


const ModalCard = (props) => {
    const { isModalVisible, handleOk, handleCancel, cards, card, titleCard, setTitleCard, memberCard, handleUpdateCardMember, isCheck, onUpdateCard } = props;
    const [isShowForm, setIsShowForm] = useState(false);
    const inputRef = useRef(null);
    const [data, setData] = useState([]);
    const [description, setDescription] = useState("");
    const [percent, setPercent] = useState(0);
    const [isShowMember, setIsShowMember] = useState(false);
    const { confirm } = Modal;
    useEffect(() => {
        apiClient.fetchApiGetTasks(card.id)
            .then((res) => {
                if (res.data !== null && res.data) {
                    setData(mapOrderCol(res.data));
                    totalPercentTask(res.data);
                    setDescription(card.description)

                } else {
                    return <NotFound />;
                }
            })
            .catch((e) => {
                return <NotFound />;
            });
    }, [])

    useEffect(() => {
        if (isShowForm === true && inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isShowForm]);



    const onTaskListDrop = (dropResult) => {
        let newData = [...data];
        newData = applyDrag(newData, dropResult);
        setData(newData);
        let dataTasks = {};
        for (let index = 0; index < newData.length; index++) {
            dataTasks = {
                name: newData[index].name,
                numberMember: 5,
                icon: "Z",
                comment: "Bách Đăng",
                timeExpiry: "2022-07-07T06:14:16.538Z",
                isActive: newData[index].isActive,
                order: index

            };
            apiClient.fetchApiUpdateTask(data[index].id, dataTasks).then((res) => {
                if (res.data) {
                    // console.log("Update success....");
                } else {
                    // console.log("Update Fail....");
                }
            });
        }

    }

    const handleAddTaskNew = (newData) => {
        const _tasks = _.cloneDeep(data);
        _tasks.push(newData);
        const taskData = [];
        _tasks.forEach(e => {
            if (e !== undefined) {
                taskData.push(e);
            }
        });
        setData(taskData);

    }

    const handleRemoveTask = (index) => {
        const itemTaskId = data[index].id;
        data.splice(index, 1);
        setData([...data]);
        totalPercentTask(data);
        if (itemTaskId) {
            apiClient.fetchApiDeleteTask(itemTaskId).then(res => {
                if (res.data) {
                    // console.log("Delete.......");
                } else {
                    // console.log("Delete.....f");
                }
            })
        }
    }

    const handlCardMember = (user) => {
        handleUpdateCardMember(user);
    }

    const onChange = (e, _i) => {
        data[_i].isActive = e.target.checked;
        const changeDateChecked = {
            name: data[_i].name,
            numberMember: 5,
            icon: "Z",
            comment: "Bách Đăng",
            timeExpiry: "2022-07-07T06:14:16.538Z",
            isActive: data[_i].isActive,
            order: data[_i].order
        }
        apiClient.fetchApiUpdateTask(data[_i].id, changeDateChecked).then(res => {
            if (res.data) {
                // console.log("Update...s");
            } else {
                // console.log("Update...f");
            }
        });
        totalPercentTask(data);
    }
    const onOk = () => {
        let data = {
            name: titleCard
        };
        apiClient.fetchApiUpdateCardName(card.id, data).then(res => {
            setTitleCard(titleCard);
            props.handleOk(titleCard);
        })
    };

    const totalPercentTask = (tasks) => {
        const taskCheckedCount = tasks.reduce((acc, task) => (acc += Number(task.isActive)), 0)
        setData([...tasks]);
        setPercent(Math.round(Math.ceil(taskCheckedCount / tasks.length * 100)))
    }
    const handleSaveDes = () => {
        if (isCheck) {
            let data = {
                "description": description
            };
            apiClient.fetchApiUpdateDescription(card.id, data).then(res => {
                alertSuccess("Thêm mô tả thành công!", 2000);
            })
        }
    };
    const handleDeleteCard = (index) => {
        const updatedCards = [...cards];
        updatedCards.splice(index, 1);
        onUpdateCard(updatedCards);
    };
    const handleDelete = () => {
        confirm({
            title: 'Bạn chắc chắn muốn xóa thẻ này',
            icon: <ExclamationCircleOutlined />,
            content: 'Xác nhận xóa',
            onOk() {
                handleCancel()
                apiClient.fetchApiDeleteCard(card.id).then(res => {
                    if (res) {
                        alertSuccess("Delete success.", 3000)
                    } else {
                        alertErrors("Delete Fail.", 3000)
                    }
                })
                setTimeout(() => {
                    handleDeleteCard(card.id)
                }, 1000)
            },
            onCancel() {
                // console.log('Cancel');
            },

        });

    }
    return (
        <>
            <Modal visible={isModalVisible} onOk={onOk} onCancel={handleCancel} >
                {
                    card.image &&
                    <img className="card-cover" width="100%" src={card.image}
                        onMouseDown={e => e.preventDefault()}
                    />
                }
                {isCheck ?

                    <input
                        style={{ width: "87%" }}
                        type="text"
                        value={titleCard}
                        onChange={e => setTitleCard(e.target.value)}
                        className="card_value_title"
                        onClick={() => setIsShowMember(false)} />
                    :
                    <span style={{ width: "87%", fontSize: '20px' }}>
                        {titleCard}
                    </span>


                }
                <p className="sub-title">expected completion: 10/05/2024</p>

                <hr></hr>
                <h6>
                    Description :
                </h6>

                {isCheck ?
                    <>
                        <TextArea rows={4} onChange={(e) => setDescription(e.target.value)} value={description != null ? description : ""} placeholder="Add a more detailed description..." />
                        <div className="gr_biit" style={{ margin: '5px 0px 15px' }}>
                            <Button type="primary" onClick={handleSaveDes}>Save</Button>
                        </div>
                    </>
                    :
                    <>
                        <TextArea rows={4} value={description != null ? description : ""} placeholder="Add a more detailed description..." />
                    </>

                }

                <TaskCard
                    onChange={onChange}
                    percent={percent}
                    setPercent={setPercent}
                    tasks={data}
                    onTaskListDrop={onTaskListDrop}
                    card={card}
                    handleAddTaskNew={handleAddTaskNew}
                    handleRemoveTask={handleRemoveTask}
                    memberCard={memberCard}
                    isCheck={isCheck}
                />
                <div className='btn-delete-card' onClick={handleDelete}>
                    <FontAwesomeIcon icon="fa-solid fa-trash"
                    />
                    <span>Delete</span>
                </div>


            </Modal>
        </>
    )
}

export default ModalCard;