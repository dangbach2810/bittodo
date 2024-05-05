import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./BoardWidget.scss";

function BoardWidget(props) {
	const { largeWidget, avt, title, idProject, setIdTarget } = props
	const handleChangeTarget = () => {
		setIdTarget(idProject)
	}
	return (
		<div
		>
			<div onClick={handleChangeTarget} className={`content-wrapper ${largeWidget ? "large" : "small"}`}>
				{avt ? (
					<img src={avt} alt=""></img>
				) : (
					<FontAwesomeIcon
						className="icon-trello"
						icon="fa-brands fa-trello"
					/>
				)}
				<span>{title}</span>
			</div>
		</div>
	);
}

export default BoardWidget;
