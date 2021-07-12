/* eslint-disable no-undef */
if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', ready);
} else {
	ready();
}

function ready() {
	inventory();
}

function inventory(){
	fetch('/dashboard/inventory')
		.then(response => response.json())
		.then(json => {
			let myInventory = json.inventory.games;
			if(myInventory.length==0){
				$('.modal-body').append('<p>'+'Go buy some games!!'+'</p>');
				return;
			}
			myInventory= sortInventory(myInventory);
			addToModal(myInventory);
		})
		.catch(error => console.log(error));

}


function addToModal(sortedInventory){

	for(let	i = 0 ; i<sortedInventory.length; i++){
		let listHTML = `<li class="list-group-item d-flex justify-content-between align-items-center inventory_game">
						<button class="btn btn-dark" data-toggle="collapse" data-target="#game_${i}">${sortedInventory[i].title} <i class="fas fa-chevron-down"></i></button>
						<h4><span class="badge badge-success">${sortedInventory[i].cdkey.length}</span></h4></li>`;

		let divHTML	= `<div id="game_${i}" class="collapse">
						<ul class = "cdkey_list">`;

		$('.modal-list').append(listHTML).append(divHTML);
		for(let j = 0 ; j<sortedInventory[i].cdkey.length ;j++){
			let liHTML = `<li class = "list-group-item"> <i class="fas fa-angle-right"></i> ${sortedInventory[i].cdkey[j]}</li>`;
			$('#game_'+i).find('.cdkey_list').append(liHTML);
		}
		$('#game_'+i).find('.cdkey_list').append('</ul>');
		$('#game_'+i).append('</div>');
	}
}

function sortInventory(inventory){
	inventory.sort(function(strA,strB){
		if(strA.title<strB.title){
			return -1;
		}
		if(strA.title>strB.title){
			return 1;
		}
		return 0;
	});
	const result = removeDups(inventory);
	return result;

}

function removeDups(inventory){
	let result = [];
	for (let i = 0; i < inventory.length; i++) {
		let data = inventory[i];
		let found=false;
		for(let j=0; j<result.length; j++) {
			if(result[j].title === data.title) {
				found=true;
				result[j].cdkey.push(data.cdkey);
				break;
			}
		}
		if(!found) {
			result.push({title:data.title,cdkey:[data.cdkey]});
		}
	}
	return result;

}
