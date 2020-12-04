export function startTimeout(action, time){
	return (dispatch) => {
		setTimeout(() => {
			action(dispatch);
		}, time);
	};
}

