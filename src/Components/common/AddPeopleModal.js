import React from "react";
import "antd/dist/antd.css";
import { Modal, Button, Input } from "antd";
import { BASE_URL_IMAGE } from "../../Contains/ConfigURL";
import Loading from "../../Pages/Loading";

function AddPeopleModel(props) {
	const { handleChange, isModalVisible, handleOk, handleCancel, nameText, loading } =
		props;

	return (
		<div>
			<Modal
				title="Thêm thành viên vào dự án"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="Thêm"
				cancelText="Kiểm tra"
			>
				<Input
					name="id"
					placeholder="Nhập số điện thoại"
					onChange={handleChange}
				/>
				{/* <Button onClick={handleCheck}>Check</Button> */}
				{
					loading ? <div className="loading-add-user"><Loading type="spin" color="blue" /></div> :
						<p>{nameText ? (
							<>
								<div className="list-client-37">
									<img src={!nameText.urlAvatar ? "https://bloganchoi.com/wp-content/uploads/2022/09/hinh-nen-co-4-la-may-man-avatar-dep-80-696x923.jpg" : BASE_URL_IMAGE + "/" + nameText.urlAvatar}>

									</img>
									<div className="list-client-37-name">
										<h6>
											{nameText.firstname + nameText.lastname}
											<p>{nameText.email}</p>
										</h6>
									</div>
								</div>
							</>
						) : nameText == null ? 'Không tìm thấy Member.' : ""}</p>
				}
			</Modal>
		</div>
	);
}

export default AddPeopleModel;
