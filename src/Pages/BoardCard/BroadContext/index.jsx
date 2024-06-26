import Column from "../Column";
import "./style.scss";
import { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { mapOrderCol } from "../../../Utils/sort";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../Utils/dragDrop";
import { PlusCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../Contains/Config";
import Menu from "../../HomePage/components/Menu";
import { apiClient } from "../../../Services";
import NotFound from "../../NotFound";
import { BACKGROUD_BOARD } from "../../../actions/dataBackgroud";
import Loading from "../../Loading";

const BroadContext = () => {
	const { boardId } = useParams();
	const [board, setBoard] = useState({});
	const [columns, setColumns] = useState([]);
	const [title, setTitle] = useState("")

	const [isShowForm, setIsShowForm] = useState(false);
	const inputRef = useRef(null);
	const [valueI, setValueI] = useState("");
	const [userLogging, setUserLogging] = useState("");
	let navigate = useNavigate();
	const token = localStorage.getItem(ACCESS_TOKEN);
	useEffect(() => {
		if (token) {
			return;
		}
		navigate("/login");
	}, [token]);

	useEffect(() => {
		if (isShowForm === true && inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isShowForm]);

	useEffect(() => {
		let data = {};

		for (let index = 0; index < columns.length; index++) {
			data = {
				name: columns[index].name,
				timeExpiry: columns[index].timeExpiry,
				order: index,
			};
			apiClient.fetchApiUpdateTab(columns[index].id, data).then((res) => {
				if (res.data) {
				} else {
				}
			});
		}
	}, [columns]);

	useEffect(() => {
		apiClient
			.fetApiProject(boardId)
			.then((res) => {
				var dem = 0;
				apiClient.fetchApiUser().then(response => {
					setUserLogging(response.data.id)
					apiClient.fetchApiGetMemberProjects(boardId).then(response2 => {

						response2.data.forEach(element => {
							if (element.id == response.data.id) {
								dem++;
							}
						});
						if (res.data !== null && res.data && dem != 0) {
							setBoard(res.data);
							setTitle(res.data.name)
						} else {
							return (
								<>
									<NotFound />
								</>
							);
						}

					});
				});
			})
			.catch((e) => {
				return <NotFound />;
			});

	}, []);

	useEffect(() => {
		apiClient
			.fetchApiGetTabs(boardId)
			.then((res) => {

				if (res.data !== null && res.data) {
					const columnsF = res.data;
					setColumns(mapOrderCol(columnsF));
				} else {
					return <NotFound />;
				}
			})
			.catch((e) => {
				return <NotFound />;
			});

	}, []);

	const onColumnDrop = (dropResult) => {
		let newColumns = [...columns];
		newColumns = applyDrag(newColumns, dropResult);

		let newBoard = { ...board };
		newBoard.columnorder = newColumns.map((column) => column.id);
		newBoard.columns = newColumns;

		setColumns(newColumns);
		setBoard(newBoard);
	};

	const onCardDrop = (dropResult, columnId) => {
		if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {

			let newColumns = [...columns];
			let currentColumns = newColumns.find((column) => column.id === columnId);

			currentColumns.cards = applyDrag(currentColumns.cards, dropResult);
			currentColumns.cardOrder = currentColumns.cards.map((card) => card.id);

			if (dropResult.payload.tabId !== currentColumns.id) {
				apiClient
					.fetchApiMoveCard(
						dropResult.payload.id,
						currentColumns.id,
						dropResult.payload.tabId,
						dropResult.addedIndex
					)
					.then((res) => {
					})
					.catch((e) => {
						return <NotFound />;
					});
			} else {
				apiClient
					.fetchApiMoveNumberCard(dropResult.payload.id, dropResult.addedIndex)
					.then((res) => {
						// console.log(res);
					})
					.catch((e) => {
						return <NotFound />;
					});
			}
			setColumns(newColumns);
		}
	};

	const handleAddList = () => {
		if (!valueI && inputRef.current) {
			inputRef.current.focus();
			return;
		}
		let data = {
			name: valueI,
			timeExpiry: "2022-06-12T02:34:18.646Z",
			order: columns.length,
		};

		apiClient.fetApiCreateTab(boardId, data).then((res) => {
			if (res.data) {
				const _columns = _.cloneDeep(columns);
				_columns.push(res.data);

				setColumns(_columns);
				setValueI("");
				inputRef.current.focus();
				inputRef.current.value("");
			} else {
				// console.log("Not success.");
			}
		});
	};

	if (_.isEmpty(board)) {
		return (
			<>
				<div className='loading-style'>
					<Loading type="spinningBubbles" color='white' />
				</div>
			</>
		);
	}

	const onUpdataColumn = (newColumn) => {
		const columnIdUpdate = newColumn.id;
		let nCols = [...columns];
		let index = nCols.findIndex((i) => i.id === columnIdUpdate);
		if (newColumn._destroy) {
			// remove
			nCols.splice(index, 1);
		} else {
			nCols[index] = newColumn;
		}

		setColumns(nCols);
	};
	const handleClickOutside = (e) => {
		const name = e.target.value
		if (name != board.name) {
			let data = {
				"name": name
			}
			console.log(data)
			apiClient.fetchApiUpdateProName(boardId, data).then((res) => {

			})
		}
	}

	return (
		<>

			<Menu checked="true" boardId={boardId} />

			<div
				className="trello-master"
				style={{
					backgroundImage: `url(${BACKGROUD_BOARD[board.background]})`,
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
				}}
			>
				<input
					class="board-title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onBlur={handleClickOutside}

				/>
				<div className="board-columns">
					<Container
						orientation="horizontal"
						onDrop={onColumnDrop}
						getChildPayload={(index) => columns[index]}
						dragHandleSelector=".column-drag-handle"
						dropPlaceholder={{
							animationDuration: 150,
							showOnTop: true,
							className: "column-drop-preview",
						}}
					>
						{userLogging == board.createdBy ?
							<>
								{columns &&
									columns.length > 0 &&
									columns.map((item, index) => (
										<Draggable key={item.id}>
											<Column
												onCardDrop={onCardDrop}
												column={item}
												onUpdataColumn={onUpdataColumn}
												isCheck={true}
											/>
										</Draggable>
									))}
							</>
							:
							<div style={{ display: 'flex' }}>
								{columns &&
									columns.length > 0 &&
									columns.map((item, index) => (
										<Column key={item.id}
											onCardDrop={onCardDrop}
											column={item}
											onUpdataColumn={onUpdataColumn}
											isCheck={false}
										/>
									))}
							</div>
						}

					</Container>

					{!isShowForm ? (
						<div className="add-new-list">
							<div className="bg_fill" onClick={() => setIsShowForm(true)}>
								<span className="icon_plus">
									<PlusCircleOutlined />
								</span>{" "}
								Add another List
							</div>
						</div>
					) : (
						<div className="add-content-list">
							<Input.Group compact>
								<Input
									style={{ width: "calc(100%)" }}
									placeholder="Enter content.."
									ref={inputRef}
									value={valueI}
									onChange={(e) => setValueI(e.target.value)}
								/>
								<div className="gr_biit">
									<Button type="primary" onClick={() => handleAddList()}>
										Add Card
									</Button>
									<CloseOutlined onClick={() => setIsShowForm(false)} />
								</div>
							</Input.Group>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default BroadContext;
