
	var localAddress = "file:///E:/Projects/Smartapps/CanvasTest/index.html";
	var localToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTMzMTExMDMsImV4cCI6MTYxMzM5NzUwMywidHlwZSI6IkJlYXJlciIsImp0aSI6IjJhOTRjMGU1LWFlMTktNDY4Yi04MGI2LTJiZTE3NjZhMmJjYyIsInN1YiI6ImYyM2VlMzJjYmEwNjdlMGUxZjUyZmY5NjMwM2YyNmZmNzEwMzU2Mzc4OWM0ZjI2NmFmMWRlMTlhMGQ3MTdkMTY1MzliZTkyNzAwNDI2Mjk4IiwiYXVkIjoiVlBTIn0.arDEhxwKs8y-8umT1UHLuBy4PBi1SzIvIQrEbZUH2HDB0S7YbD__brM_hefMvytRMgRCSY0AP8QIyzdmoVJjQF46WkgFHFjIfGj6-qvAlDud7sb1XOFEixOomKoB6aQ13L0wzfwaj-Hdp4fVM9bXqdy5PgBLZmGO4v1xzQKkVqhLqJg6s4dyYzqZl8CbW9PO3q56AsDXat46RIY1lXM_t5Jk1alXZTkL6g_HW3pR1lkpI3Kjbuyra6i8eoxj1v9DOTPY1KMTRwq44i_yIht2vNawzi_Sns84G-5TJl8KEiAk7ORzLWY8RNkJOFMgmfCEiMkjfbJeGviNm5Jxqw72wqVbv1uzAIFC7HCs2YG3g3xGlmiSPdKcPrFpkv7VT5xGSeP9uCaTIW1ilUfPufVe4svR4t1ZhLDG7msyGXWEDWpJ7-tx1V4_gyM4aJe_7EFnvo0NtoPpJI_kMkK_Fleabjv8ahIhSF3UElveLQ7Rf2oqkEjUnLCdMeGA85ZnXKii8nblTZj0FjmVVbZ095wPyTK3ZcC44PlruHevnNmQyKiM6zeMSmkJ4I-5EWnFb1bm6ViQwA30iPI-Fti5GPNpNInOUz9ebJCWBh19nreTKeIS9GEYwvqVjHIBH6bpY7hCsW5sNo61V3XqoYyttfkuZnhky8VdqmNofCaS5XINv8c';
	const development = document.URL == localAddress;

	const initialize = (getState, getRecoveryState) => {
		if (development) {
			return assistant.createSmartappDebugger({
				// Токен из Кабинета разработчика
				token: localToken,
				// Пример фразы для запуска приложения
				initPhrase: 'Запусти пиратское приключение',
				// Функция, которая возвращает текущее состояние приложения
				getState,
				// Функция, возвращающая состояние приложения, с которым приложение будет восстановлено при следующем запуске
				getRecoveryState,
			});
		}

		  // Только для среды production
		return assistant.createAssistant({ getState, getRecoveryState });
	}
	
	var state = "";
	var recoveryState = "";
	
	
	const assistantItem = initialize(() => state, () => recoveryState);
	assistantItem.on('data', (command) => {
		console.log(command);
		if (command.type == "smart_app_data" && command.action != null && command.action.message != null) {
			UpdateText(canvas, command.action.message);
		}
	});
	
	const handleOnClick = () => {
		// Отправка сообщения ассистенту с фронтенд.
		// Структура может меняться на усмотрение разработчика, в зависимости от бэкенд
		assistantItem.sendData({ action: { action_id: 'some_action_name' } });
	};
	
	var 
		width = 1024,
		height = 768;
	
	function UpdateText(canvas, text) {
		// clear
		canvas.fillStyle    = '#000000';  // black
		canvas.fillRect ( 0, 0, width, height);
		canvas.fillStyle    = '#ffffff';  // white
		canvas.fillRect ( 5, 5, 5, 5);
		// help
		canvas.font = "14pt Arial";
		canvas.fillText(text, 50, 50);
	}

	// init
	var canvasElement = document.getElementById('tutorial');
	var canvas = canvasElement.getContext('2d');
	canvasElement.width = width;
	canvasElement.height = height;
	
	UpdateText(canvas, document.URL);
	
	// clear
	//canvas.fillStyle    = '#000000';  // black
	//canvas.fillRect ( 0, 0, width, height);
	//canvas.fillStyle    = '#ffffff';  // white
	//canvas.fillRect ( 40, 40, 140, 140);
	// help
	//canvas.font = "14pt Arial";
	//canvas.fillText("test ", 10, 10);