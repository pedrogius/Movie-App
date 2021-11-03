import React, { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import YouTube from 'react-youtube';
import { CaretRightOutlined } from '@ant-design/icons';

const TrailerModal = ({ id, type }) => {
	const [visible, setVisible] = useState(false);
	const playerRef = useRef(null);

	const stopVideo = () => {
		playerRef.current.internalPlayer.stopVideo();
	};

	const opts = {
		height: '390',
		width: '640',
		playerVars: {
			autoplay: 1,
		},
	};

	return (
		<>
			<Button
				onClick={(e) => {
					e.stopPropagation();
					setVisible(true);
				}}
				id={type === 'transparent' ? 'trailer-button' : ''}
			>
				<CaretRightOutlined /> Trailer
			</Button>
			<Modal
				footer={null}
				closable={false}
				visible={visible}
				onCancel={(e) => {
					e.stopPropagation();
					stopVideo();
					setVisible(false);
				}}
				width={690}
			>
				<YouTube videoId={id} opts={opts} ref={playerRef} />
			</Modal>
		</>
	);
};

export default TrailerModal;
