/* eslint-disable no-undef */

if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', ready);
} else {
	ready();
}

function ready() {
	const toggleButton = document.getElementsByClassName('toggle-button')[0];
	const navbarLinks = document.getElementsByClassName('navbar-links')[0];
	const search = document.getElementById('search');
	const matchList = document.getElementById('match-list');

	//Search games
	const searchGames = async (searchText) => {
		const res = await fetch('/games');
		const games = await res.json();
		//Get matches to current text input
		let matches = games.filter((game) => {
			const regex = new RegExp(`^${searchText}`, 'gi');
			return game.title.match(regex);
		});

		if (searchText.length === 0) {
			matches = [];
			matchList.innerHTML = '';
		}

		output(matches);
	};

	//Result
	const output = (matches) => {
		if (matches.length > 0) {
			const div = matches
				.map(
					(match) => `
			<div class="p-2">
				<div class="row" onclick="location.href='/game/${match.id}'">
					<div class="col-5 text-left">
						<img src="${match.picture}" alt="" width="70" class="img-fluid rounded shadow-sm">
					</div>
					<div class="col-5 text-center">
						<h5>${match.title}</h5>
					</div>
				</div>
				
			</div>
			`
				)
				.join('');
			matchList.innerHTML = div;
		}
	};

	search.addEventListener('input', () => searchGames(search.value));

	toggleButton.addEventListener('click', () => {
		navbarLinks.classList.toggle('active');
	});

	// eslint-disable-next-line no-unused-vars
	$('.product-top .overlay-right .btn-primary').each(function (_index) {
		$(this).on('click', function (e) {
			e.preventDefault();
			let gameId = $(this).attr('href');
			alert('Added to cart!');
			$.ajax({
				async: true,
				type: 'GET',
				url: gameId,
			});
			let currentAmount = parseInt($('.badge').text()) + 1;
			$('.badge').text(currentAmount);
		});
	});
}
