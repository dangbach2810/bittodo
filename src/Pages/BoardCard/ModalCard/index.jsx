import { Button, Modal, DatePicker } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState, useEffect, useRef } from 'react';
import moment from "moment";
import { WarningOutlined } from '@ant-design/icons';
import './style.scss';
import TaskCard from '../TaskCard';
import { applyDrag } from '../../../Utils/dragDrop';
import { apiClient } from '../../../Services';
import NotFound from '../../NotFound';
import { mapOrderCol } from '../../../Utils/sort';
import { alertSuccess } from "../../../Contains/Config";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ModalCard = (props) => {
    const { isModalVisible, handleCancel, card, titleCard, setTitleCard, memberCard, isCheck, handleRemoveCard } = props;

    const [isShowForm, setIsShowForm] = useState(false);
    const inputRef = useRef(null);
    const [data, setData] = useState([]);
    const [description, setDescription] = useState("");
    const [percent, setPercent] = useState(0);
    const [estimatedFinish, setEstimatedFinish] = useState(new Date())
    const [isShowMember, setIsShowMember] = useState(false);
    const { confirm } = Modal;

    useEffect(() => {
        if (isModalVisible) {
            // console.log('Abc modal', card)
            // console.log('Abc modal title props', titleCard)
            // console.log('Abc modal task', data)
        }
    }, [isModalVisible]);
    useEffect(() => {
        if (!isModalVisible) return;

        apiClient.fetchApiGetTasks(card.id)
            .then((res) => {
                if (res.data !== null && res.data) {
                    setData(mapOrderCol(res.data));
                    totalPercentTask(res.data);
                    setDescription(card.description)
                    if (card.estimatedFinish != null) {
                        setEstimatedFinish(new Date(card.estimatedFinish))
                    }
                } else {
                    return <NotFound />;
                }
            })
            .catch((e) => {
                return <NotFound />;
            });
    }, [isModalVisible])

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
    const handleChangeEsf = () => {
        let data = {
            estimatedFinish: estimatedFinish
        };
        apiClient.fetchApiUpdateEsFinish(card.id, data).then(res => { })
    }
    const confirmDeleteCard = () => {
        confirm({
            title: 'Bạn chắc chắn muốn xóa thẻ này không?',
            icon: <WarningOutlined />,
            content: 'Xóa vĩnh viễn thẻ',
            onOk() {

                handleRemoveCard(card.id)
                alertSuccess("Delete success.", 3000)
                handleCancel()
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
                {isCheck ?
                    <p className="sub-title">Dự kiến hoàn thành: <DatePicker
                        value={moment(estimatedFinish)}
                        onChange={(date) =>
                            setEstimatedFinish(
                                date.locale("vi").format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
                            )
                        }
                        onBlur={handleChangeEsf}
                    /></p>
                    :
                    <p style={{ fontSize: '20px' }}>Dự kiến hoàn thành:
                        {estimatedFinish.getDate()}/{estimatedFinish.getMonth() + 1}/{estimatedFinish.getFullYear()}
                    </p>
                }
                <hr></hr>
                <h6>
                    Mô tả :
                </h6>
                {isCheck ?
                    <>
                        <TextArea rows={4} onChange={(e) => setDescription(e.target.value)} value={description != null ? description : ""} placeholder="Thêm mô tả chi tiết hơn..." />
                        <div className="gr_biit" style={{ margin: '5px 0px 15px' }}>
                            <Button type="primary" onClick={handleSaveDes}>Lưu</Button>
                        </div>
                    </>
                    :
                    <>
                        <TextArea rows={4} value={description != null ? description : ""} placeholder="Mô tả chi tiết..." />
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
                <div className="btn-delete-card" onClick={confirmDeleteCard}>
                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                    Xóa thẻ
                </div>
            </Modal>
        </>
    )
}

export default ModalCard;