import { QuarkElement, property, customElement, state, createRef } from "quarkc"
import style from "./index.less?inline"
import classnames from "classnames";
import moment from 'moment';

declare global {
	interface HTMLElementTagNameMap {
		"sw-calendar": Calendar;
	}
}

@customElement({ tag: "sw-calendar", style })
class Calendar extends QuarkElement {
	@property({ type: Number }) // 外部属性
	count = 0

	@property({ type: String })
	text = ''
	@property()
	sheetSize = null

	@state()
	currentDate = moment();
	@state()
	choose = null;
	day = moment().date();
	hRef: any = createRef()



	shouldComponentUpdate(propName, oldValue, newValue) {
		console.log('shouldComponentUpdate-propName', propName)
		console.log('oldValue', oldValue)
		console.log('newValue', newValue)

		if (propName === "xxx") {
			// 阻止更新
			return false
		}
		return true
	}
	componentDidMount() {
		console.log('componentDidMount')
		this.getDay()


	}




	componentDidUpdate(a, b) {

		this.getDay()

	}

	componentWillUnmount() {
		// 清除副作用

	}


	nextMonth = () => {
		this.currentDate = this.currentDate.clone().add(1, 'month')
		this.choose = null

	};

	prevMonth = () => {
		this.currentDate = this.currentDate.clone().subtract(1, 'month')
		this.choose = null

	};

	nextYear = () => {
		this.currentDate = this.currentDate.clone().add(1, 'year')
		this.choose = null

	};

	prevYear = () => {
		this.currentDate = this.currentDate.clone().subtract(1, 'year')
		this.choose = null


	};
	getDay = () => {
		let currentDate = this.currentDate
		if (this.currentDate.format('YYYYMM') === moment().format('YYYYMM')) {
			currentDate = moment()
		}
		let day;
		// 获取当前月的总天数
		const lastDayOfCurrentMonth = currentDate.daysInMonth();
		// 获取当前是几号
		const currentDay = currentDate.date();
		const currentDay1 = currentDate.format('DD');
		if (currentDate.format('YYYYMM') !== moment().format('YYYYMM')) {
			day = lastDayOfCurrentMonth
		} else {
			if (currentDay === lastDayOfCurrentMonth) {
				// 如果当前日期等于当前月的最后一天，则表示已经过完本月
				day = lastDayOfCurrentMonth
			} else {
				// 如果当前日期不等于当前月的最后一天，则表示还没过完本月
				day = currentDay
			}
		}
		this.day = day

	}
	renderCalendarDays = () => {
		const daysInMonth = this.currentDate.daysInMonth();
		let firstDayOfMonth = parseInt(this.currentDate.startOf('month').format('d')); // 0 for Sunday, 1 for Monday, ...
		const days = [];
		// 空白格子填充
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(<div key={`empty-${i}`} className="empty-day"></div>);
		}
		console.log('renderCalendarDays', this.choose, this.day)
		const num = this.choose || this.day
		const show = this.currentDate.format('YYYYMM') === moment().format('YYYYMM')
		for (let day = 1; day <= daysInMonth; day++) {
			const name = this.currentDate > moment() ? "disabled span" : num === day ? "choose span" : this.day < day ? "disabled span" : "span"
			days.push(<div onClick={() => {
				if (this.day >= day) {
					this.choose = day
				}
			}} key={day} className="calendar-day">
				<div className={name}>{day}</div>
				<div className="dot">{show && day === moment().date() ? "'" : ""}</div>
			</div>);
		}

		return days;
	};
	renderWeekdays = () => {
		const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',];

		return weekdays.map((day, index) => (
			<div key={index} className="weekday">{day}</div>
		));
	};
	render() {

		console.log('this.currentDate', this.currentDate)
		console.log('this.day', this.day)
		console.log('this.choose', this.choose)

		return (
			<div className="calendar-container">
				<div className="calendar-header">
					<button onClick={this.prevYear}>上一年</button>
					<button onClick={this.prevMonth}>上一月</button>
					<h2>{this.currentDate.format('YYYY')}年{this.currentDate.format('MM')}月{this.currentDate.format('DD')}</h2>
					<button onClick={this.nextMonth}>下一月</button>
					<button onClick={this.nextYear}>下一年</button>
				</div>
				<div className="calendar-weekdays">
					{this.renderWeekdays()}
				</div>
				<div className="calendar-days">
					{this.renderCalendarDays()}
				</div>
			</div>
		);
	}
}

export default Calendar;







// import React, { useState } from 'react';
// import moment from 'moment';

// function Calendar() {
//   const [currentDate, setCurrentDate] = useState(moment());

//   const nextMonth = () => {
//     setCurrentDate(currentDate.clone().add(1, 'month'));
//   };

//   const prevMonth = () => {
//     setCurrentDate(currentDate.clone().subtract(1, 'month'));
//   };

//   const nextYear = () => {
//     setCurrentDate(currentDate.clone().add(1, 'year'));
//   };

//   const prevYear = () => {
//     setCurrentDate(currentDate.clone().subtract(1, 'year'));
//   };

//   const renderCalendarDays = () => {
//     const daysInMonth = currentDate.daysInMonth();
//     const firstDayOfMonth = currentDate.startOf('month').format('d'); // 0 for Sunday, 1 for Monday, ...
//     const days = [];

//     // 空白格子填充
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<div key={`empty-${i}`} className="empty-day"></div>);
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push(<div key={day} className="calendar-day">{day}</div>);
//     }

//     return days;
//   };

//   return (
//     <div className="calendar-container">
//       <div className="calendar-header">
//         <button onClick={prevYear}>上一年</button>
//         <button onClick={prevMonth}>上一月</button>
//         <h2>{currentDate.format('MMMM YYYY')}</h2>
//         <button onClick={nextMonth}>下一月</button>
//         <button onClick={nextYear}>下一年</button>
//       </div>
//       <div className="calendar-days">
//         {renderCalendarDays()}
//       </div>
//     </div>
//   );
// }

// export default Calendar;
