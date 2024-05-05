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
import Today from "../Today"
import { apiClient } from "../../Services";
export default function Workspace() {
	const { Meta } = Card;
	let navigate = useNavigate();
	const token = localStorage.getItem(ACCESS_TOKEN);
	const [idTarget, setIdTarget] = useState()
	const [isShow, setShow] = useState(false)
	const [project, setProject] = useState([]);
	useEffect(() => {
		if (token) {
			return;
		}
		navigate("/login");
	}, [token]);

	useEffect(() => {
		apiClient.fetchApiGetProjects().then(res => {
			if (res.data) {
				setProject(res.data);
			} else {
			}

		}).catch(e => {
		});
	}, [])

	const setId = (id) => {
		apiClient.fetApiProject(id).then(res => {
			if (res.data) {
				setIdTarget(res.data.id)
				setShow(true)
			} else {
			}
		}).catch(e => {
		});
	}
	// console.log(project)
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
								<span>Tiến độ công việc</span>
							</div>
						</Row>
						<Row>
							<Col sm={12}>
								{project.map((data, key) => (
									<BoardWidget key={key}
										title={data.name}
										avt="https://i.pinimg.com/736x/76/07/5c/76075c11bfe509ee9a11d9baa991c40d.jpg"
										largeWidget={true}
										idProject={data.id}
										setIdTarget={setId}
									/>
								))}
							</Col>
						</Row>
					</Col>
					<Col className="side-content" sm={3}>
						<h4>Complete</h4>
						<div className="label-container">
							<div className="label">
								<span className="date">Dự kiến: 10-5-2024</span>
								<p className="name">Thẻ: So sánh nhất</p>
								<p className="content">Đang nằm ở cột: Done</p>
								<p className="content">Đã hoàn thành 1/1 nhiệm vụ</p>
							</div>
							<div className="label">
								<span className="date">Dự kiến: 10-5-2024</span>
								<p className="name">Thẻ: So sánh nhất</p>
								<p className="content">Đang nằm ở cột: Done</p>
								<p className="content">Đã hoàn thành 1/1 nhiệm vụ</p>
							</div>
							<div className="label">
								<span className="date">Dự kiến: 10-5-2024</span>
								<p className="name">Thẻ: So sánh nhất</p>
								<p className="content">Đang nằm ở cột: Done</p>
								<p className="content">Đã hoàn thành 1/1 nhiệm vụ</p>
							</div>
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
							<p>Khi bạn được thêm vào một mục trong danh mục, mục đó sẽ hiển thị ở đây.</p>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}
