const kebabCaser = string => string.split(' ').join('-').toLowerCase();

const $timingButtons = document.querySelectorAll('.timing__button');
const $main = document.querySelector('main');

const loadData = async timeframe => {
	$timingButtons.forEach(element =>
		element.classList.contains(timeframe)
			? element.classList.add('active')
			: element.classList.remove('active'),
	);
	try {
		const fetchResponse = await fetch(
				'/FM-10-time-tracking-dashboard/data.json',
			),
			jsonResponse = await fetchResponse.json();

		let template = '';

		for (const element of jsonResponse) {
			const elementClass = kebabCaser(element.title);
			const measure = { daily: 'day', weekly: 'week', monthly: 'month' }[
				timeframe
			];
			template += `
				<article class="item ${elementClass}">
				<div class="item__background ${elementClass}">
					<img src="./images/icon-${elementClass}.svg" alt="" class="item__background__image">
				</div>
				<div class="item__content">
					<div class="item__content__title">
						<p class="item__content__title__text">${element.title}</p>
						<img src="./images/icon-ellipsis.svg" alt="">
					</div>
					<div class="item__content__counting">
						<p class="item__content__counting__current">${element.timeframes[timeframe].current}hrs</p>
						<p class="item__content__counting__last">Last ${measure} - ${element.timeframes[timeframe].previous}hrs</p>
					</div>
				</div>
			</article>`;
		}
		$main.innerHTML = template;
	} catch (catchedError) {
		console.log(catchedError);
		$main.innerHTML = `
			<h1>An error has happened</h1>
		`;
	}
};

document.addEventListener('DOMContentLoaded', async event =>
	loadData('weekly'),
);

document.addEventListener('click', event => {
	if (event.target.matches('.timing__button'))
		loadData(event.target.getAttribute('data-timing'));
});
