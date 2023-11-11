import React from "react";
import list from '../img/list.svg';
import message from '../img/message.svg';
import plus from '../img/plus.svg';
import block from '../img/block.svg';
import "./Profile.css";

function Profile() {
	return (
		<div className="profile">
			<div className="profile-topbar">
				<div className="profile-topbar-picture">
					<img src={list} alt="profile"/>
				</div>
				<div className="profile-topbar-fullname">
					<span className="profile-topbar-name">Bob jeff</span>
					<span className="profile-topbar-nickname">(bjeff)</span>
				</div>
				<div className="profile-topbar-button">
					<button className="profile-topbar-button-message btn btn-primary btn-lg" title="Send message"><img className="profile-topbar-img" src={message} alt="send message"></img></button>
					<button className="profile-topbar-button-invite btn btn-success btn-lg" title="Invite"><img className="profile-topbar-img" src={plus} alt="invite"></img></button>
					<button className="profile-topbar-button-block btn btn-danger btn-lg" title="Block"><img className="profile-topbar-img" src={block} alt="block"></img></button>
				</div>
			</div>
			<div className="profile-content">
				<div className="profile-stats">
					<div className="profile-title">Stats</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Win:</span>
						<span className="profile-stat-value">8</span>
					</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Lose:</span>
						<span className="profile-stat-value">8</span>
					</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Total game:</span>
						<span className="profile-stat-value">16</span>
					</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Win rate:</span>
						<span className="profile-stat-value">50%</span>
					</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Ball hit:</span>
						<span className="profile-stat-value">32</span>
					</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Goal:</span>
						<span className="profile-stat-value">8</span>
					</div>
					<div className="profile-stat">
						<span className="profile-stat-name">Tournament win:</span>
						<span className="profile-stat-value">2</span>
					</div>
				</div>

				<div className="profile-game-history">
					<div className="profile-title">Game history</div>
					<div className="profile-games">
						<div className="profile-game">
							<span className="profile-game-date">11/11/2023 18:05</span>
							<div className="profile-game-score">
								<span className="profile-game-score-name">Player-1</span>
								<span className="profile-game-score">(5)</span>
								<span className="profile-game-versus">VS</span>
								<span className="profile-game-score">(2)</span>
								<span className="profile-game-score-name">Player-2</span>
							</div>
							<span className="profile-game-status win">WIN</span>
						</div>
						<div className="profile-game">
							<span className="profile-game-date">11/11/2023 18:05</span>
							<div className="profile-game-score">
								<span className="profile-game-score-name">Player-1</span>
								<span className="profile-game-score">(2)</span>
								<span className="profile-game-versus">VS</span>
								<span className="profile-game-score">(5)</span>
								<span className="profile-game-score-name">Player-2</span>
							</div>
							<span className="profile-game-status loose">LOOSE</span>
						</div>
						<div className="profile-game">
							<span className="profile-game-date">11/11/2023 18:05</span>
							<div className="profile-game-score">
								<span className="profile-game-score-name">Player-1</span>
								<span className="profile-game-score">(5)</span>
								<span className="profile-game-versus">VS</span>
								<span className="profile-game-score">(2)</span>
								<span className="profile-game-score-name">Player-2</span>
							</div>
							<span className="profile-game-status win">WIN</span>
						</div>
					</div>
				</div>

				<div className="profile-tournament-history">
					<div className="profile-title">Tournament history</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
