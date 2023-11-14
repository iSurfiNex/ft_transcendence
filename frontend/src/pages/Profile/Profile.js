import React from "react";
import "./Profile.css";
import ProfileTop from "./ProfileTop"
import Stats from "./Stats"

function Profile() {
	return (
		<div className="profile">
			<ProfileTop />

			<div className="profile-content">
				<Stats />

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
