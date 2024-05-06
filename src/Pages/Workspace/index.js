import { Col, Container, Row } from "react-bootstrap";

import SideBar from "../../Components/sideBar/SideBar";
import "./styles.scss";
import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../../Contains/Config";
import { useNavigate } from "react-router-dom";
import Menu from "../HomePage/components/Menu";
import "antd/dist/antd.css";
import { Card } from "antd";
import BoardWidget from "../../Components/common/BoardWidget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Complete from "../Complete"
import { BACKGROUD_BOARD } from "../../actions/dataBackgroud";
import Today from "../Today"

import { apiClient } from "../../Services";
export default function Workspace() {
	const { Meta } = Card;
	let navigate = useNavigate();
	const token = localStorage.getItem(ACCESS_TOKEN);
	const [project, setProject] = useState([]);
	const [cards, setCards] = useState([])
	useEffect(() => {
		if (token) {
			return;
		}
		navigate("/login");
	}, [token]);

	useEffect(() => {
		apiClient.fetchApiGetWorkspaceProjects().then(res => {
			if (res.data) {
				setProject(res.data);
			} else {
			}
		}).catch(e => {
		});
	}, [])

	const setId = (id) => {
		apiClient.fetApiComplete(id).then(res => {
			setCards(res.data)

		}).catch(e => {
		});
	}
	console.log("C: ", cards)
	return (
		<>
			<Menu />
			<Container className="main-content-container">
				<Row className="main-row">
					{/* <Col sm={3}>
						<SideBar />
					</Col> */}

					<Col className="side-content" sm={3}>
						<Row>
							<div className="side-title">
								<FontAwesomeIcon
									className="icon-trello"
									icon="fa-solid fa-clock"
								/>
								<span>Công việc của bạn</span>
							</div>
						</Row>
						<Row>
							<Col sm={12}>
								{project.map((data, key) => (
									<BoardWidget key={key}
										title={data.name}
										avt={BACKGROUD_BOARD[data.background]}
										largeWidget={true}
										idProject={data.id}
										setIdTarget={setId}
									/>
								))}
							</Col>
						</Row>
					</Col>
					<Col className="side-content" sm={3}>

						<h4>Các thẻ đã hoàn thành hết nhiệm vụ</h4>
						<div className="label-container">

							{cards.length == 0 ?
								<div>Có vẻ như bạn chưa tạo thẻ nào</div>
								:
								<>
									{cards.map((data, key) => (
										<div className="label">
											<p className="name">Thẻ: {data.name}</p>
											<p className="content">Mô tả: {data.description != null ? data.description : "Chưa thêm mô tả"}</p>
											<p className="content">Done <FontAwesomeIcon icon="fa-solid fa-circle-check" /></p>
											<span className="date">{data.estimatedFinish}</span>

										</div>
									))}
								</>
							}
						</div>

					</Col>
					<Col className="s" sm={6}>
						<div className="card-wrapper">
							<Card
								hoverable
								className="card-content"
								cover={
									<img
										alt="example"
										src="https://a.trellocdn.com/prgb/dist/images/home/orientation/no-content.e55b3540e5c1f06a51d7.svg"
									/>
								}
							>
								<Meta
									title="Cập nhật thông tin"
									description="Mời mọi người vào nhóm, thêm mô tả, thêm ngày đến hạn và chúng tôi sẽ hiển thị hoạt động quan trọng nhất tại đây."
								/>

							</Card>

						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}
