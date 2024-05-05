import Card from "../Card";
import { Container, Draggable } from "react-smooth-dnd";
import { Input, Modal } from "antd";
import { useState, useEffect, useRef } from 'react';
import { CloseOutlined, AlignRightOutlined, WarningOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { apiClient } from "../../../Services";
import { alertErrors, alertSuccess } from "../../../Contains/Config";


const Column = (props) => {

    const { TextArea } = Input;
    const { confirm } = Modal;

    const [isShowAddNewCard, setIsShowAddNewCard] = useState(false);
    const [valueTextArea, setValueTextArea] = useState("");
    const textAreaRef = useRef(null);

    const [titleColumn, setTitleColumn] = useState("");
    const [isFirstClick, setIsFirstClick] = useState(true);
    const inputRef = useRef(null);

    const { column, onCardDrop, onUpdataColumn, isCheck } = props;
    const cards = column.cards;

    useEffect(() => {
        if (isShowAddNewCard === true && textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
        }

    }, [isShowAddNewCard])

    useEffect(() => {
        if (column && column.name) {
            setTitleColumn(column.name)
        }
    }, [])
    const selectAllText = (e) => {
        setIsFirstClick(false);
        if (isFirstClick) {
            e.target.select();
        } else {
            inputRef.current.setSelectionRange(titleColumn.length, titleColumn.length);
        }
        // e.target.focus();
    }

    function confirmModal(id) {
        confirm({
            title: 'Bạn chắc chắn muốn xóa cột này?',
            icon: <WarningOutlined />,
            content: 'Xóa vĩnh viễn cột này',
            onOk() {
                apiClient.fetchApiDeleteTab(id).then(res => {
                    if (res) {
                        alertSuccess("Delete success.", 3000)
                    } else {
                        alertErrors("Delete Fail.", 3000)
                    }
                })

                setTimeout(() => {
                    const newColumn = {
                        ...column,
                        _destroy: true
                    }
                    onUpdataColumn(newColumn);
                }, 1000)
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    const handleClickOutSide = () => {
        if (isCheck) {

            try {
                let dataName = {
                    name: titleColumn
                }
                setTimeout(() => {
                    fetchConfigApi(column.id, dataName);
                }, 2000);
            } catch (e) {
                console.log(e);
            }
            setIsFirstClick(true);
        }
    }

    const handleAddNewCard = () => {
        if (isCheck) {

            if (!valueTextArea) {
                textAreaRef.current.focus();
                return;
            }

            const newCard = {
                name: valueTextArea,
                numberMember: 5,
                timeExpiry: "2022-06-12T02:34:18.646Z",
                order: cards.length,
                description: ""
            }

            apiClient.fetchApiCreateCard(column.id, newCard).then(res => {
                if (res.data) {
                    newCard.id = res.data.id;
                } else {
                    // console.log("Create Card Fail.")
                }
            })
            let newColumn = { ...column };
            newColumn.cards = [...newColumn.cards, newCard];
            newColumn.cardOrder = newColumn.cards.map(card => card.id);

            onUpdataColumn(newColumn);
            setValueTextArea("");
            setIsShowAddNewCard(false);
        }

    }
    const handleRemoveCard = (cardId) => {
        if (isCheck) {
            // Gọi hàm xóa thẻ từ API
            apiClient.fetchApiDeleteCard(cardId).then(res => {
                let updatedColumn = { ...column };
                updatedColumn.cards = updatedColumn.cards.filter(card => card.id !== cardId);
                updatedColumn.cardOrder = updatedColumn.cards.map(card => card.id);
                onUpdataColumn(updatedColumn);
                setValueTextArea("");
                setIsShowAddNewCard(false);
            }).catch(error => {
                console.error("Error deleting card:", error);
            });
        }

    }

    function fetchConfigApi(id, dataName) {
        try {
            apiClient.fetchApiUpdateNameTab(id, dataName).then(res => {
                // Success .............
            })
        } catch (e) {
            // console.log("error response", e.response);
        }
    }
    // Handle OnChangeNameColumn
    const onChangeNameColumn = async (e) => {
        if (isCheck) {

            if (titleColumn === e.target.value) {
                return;
            }

            setTitleColumn(e.target.value);
        }
    }

    // const onModalAction = (type) => {
    //     if (type === MODAL_ACTION_CLOSE) {
    //         // do thing
    //     }

    //     if (type === MODAL_ACTION_CONFIRM) {
    //         // remove col
    //     }
    // }

    const menu = (
        <Menu style={{ backgroundColor: 'pink' }}>
            <Menu.Item key="1">
                Thêm thẻ.
            </Menu.Item>
            <Menu.Item key="2">
                <div onClick={() => confirmModal(column.id)}>Xóa cột này</div>
            </Menu.Item>
            {/* <Menu.Item key="3">
                Something else
            </Menu.Item> */}
        </Menu>
    );

    return (
        <>
            <div className="column">
                <header className="column-drag-handle">
                    <div className="column-title">
                        <input
                            style={{ width: "87%" }}
                            type="text"
                            value={titleColumn}
                            className="customize-input-col"
                            onChange={e => onChangeNameColumn(e)}
                            onClick={selectAllText}
                            spellCheck="false"
                            onBlur={handleClickOutSide}
                            onMouseDown={e => e.preventDefault()}
                            ref={inputRef}
                        />

                        <Dropdown overlay={menu} placement="bottom" arrow>
                            <AlignRightOutlined />
                        </Dropdown>
                    </div>
                </header>
                <ul className="boxBar">
                    <Container
                        {...column.props}
                        groupName="col"
                        // onDragStart={e => console.log("drag started", e)}
                        // onDragEnd={e => console.log("drag end", e)}
                        onDrop={dropResult => onCardDrop(dropResult, column.id)}
                        getChildPayload={index =>
                            cards[index]
                        }
                        dragClass="card-ghost"
                        dropClass="card-ghost-drop"
                        // onDragEnter={() => {
                        //   console.log("drag enter:", column.id);
                        // }}
                        // onDragLeave={() => {
                        //   console.log("drag leave:", column.id);
                        // }}
                        // onDropReady={p => console.log('Drop ready: ', p)}
                        dropPlaceholder={{
                            animationDuration: 150,
                            showOnTop: true,
                            className: 'card-drop-preview'
                        }}
                        dropPlaceholderAnimationDuration={200}
                    >
                        {
                            cards && cards.length > 0 && cards.map((item, index) => (
                                <>
                                    {isCheck ?

                                        <Draggable key={index} >
                                            <Card
                                                card={item}
                                                isCheck={isCheck}
                                                handleRemoveCard={handleRemoveCard} />
                                        </Draggable>
                                        :
                                        <div key={index} >
                                            <Card
                                                card={item}
                                                isCheck={isCheck}
                                            />
                                        </div>
                                    }
                                </>
                            ))
                        }
                    </Container>
                    {isCheck && <>
                        {isShowAddNewCard && <div className="add-content-card">
                            <Input.Group compact>
                                <TextArea rows={2} placeholder="Enter a title for this card.." ref={textAreaRef}
                                    value={valueTextArea}
                                    onChange={e => setValueTextArea(e.target.value)}
                                />
                                <div className="gr_biit">
                                    <Button type="primary" onClick={() => handleAddNewCard()}>Add Card</Button>
                                    <CloseOutlined onClick={() => setIsShowAddNewCard(false)} />
                                </div>
                            </Input.Group>
                        </div>}
                        {!isShowAddNewCard && <footer>
                            <div className="footer-action">
                                <div className="bg_fill" onClick={() => setIsShowAddNewCard(true)}>
                                    <span className="icon_plus"><PlusCircleOutlined /></span> Add a Card
                                </div>
                            </div>
                        </footer>}

                    </>
                    }

                </ul>


            </div>
        </>
    )
}

export default Column;