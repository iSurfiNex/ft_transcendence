import { useContext, useState, useEffect } from 'react';
import GlobalContext from '../../index';

function Stats() {
	const { globalData, updateGlobal } = useContext(GlobalContext);

	const user = globalData.jsonMap.users.find(user => user.nickname === globalData.jsonMap.whoAmI);
	const [data, setData] = useState([2, 1, 3]);
	const maxValue = Math.max(...data);
	const ratios = data.map(value => (value / maxValue) * 90);

	return (
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

			<div className="profile-chart">
				{ratios.map((value, index) => (
					<div key={index} className="profile-bar" style={{ height: `${Math.max(value, 8)}%` }}>
						{data[index]}
					</div>
				))}
			</div>
			<div className="profile-chart-desc">
				<div className="profile-bar-desc">WIN</div>
				<div className="profile-bar-desc">LOOSE</div>
				<div className="profile-bar-desc">TOTAL</div>
			</div>
		</div>
	);
}

export default Stats;
