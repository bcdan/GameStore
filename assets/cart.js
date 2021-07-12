/* eslint-disable no-undef */
if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', ready);
} else {
	ready();
}

function ready() {
	removeCartItem();
	reduceCartItem();
}

function reduceCartItem(){
	$('.align-middle.reduce').each(function(){
		$(this).find('a').on('click',function(e){
			e.preventDefault();
			let gameId = $(this) .attr('href');       
			let currentQty = parseInt($(this).parent().parent().find('.align-middle.qty').text())-1;
			if(currentQty<1){
				$(this).parent().parent().remove();
			}
			$.ajax({
				async:true,
				type:'GET',
				url:gameId,
			});
			$(this).parent().parent().find('.align-middle.qty').text(currentQty);
			updateCartTotal();
		});
	});

}
function removeCartItem(){   
	$('.align-middle.remove').each(function(){
		$(this).find('a').on('click',function(e){
			e.preventDefault();
			let gameId = $(this) .attr('href');
			$(this).parent().parent().remove();
			$.ajax({
				async:true,
				type:'GET',
				url:gameId,
			});
			updateCartTotal();
		});
	});
}

function updateCartTotal(){
	let cartItemContainer = document.getElementsByClassName('table')[0];
	let cartRows = cartItemContainer.getElementsByClassName('cart_row');
	let total = 0,totalQty=0;
	for(let i =0 ; i <cartRows.length; i++){
		let cartRow = cartRows[i];
		let priceElement = cartRow.getElementsByClassName('align-middle price')[0];
		let quantityElement = cartRow.getElementsByClassName('align-middle qty')[0];
		let price = parseFloat(priceElement.innerText.replace('$',''));
		let quantity = parseInt(quantityElement.innerText);
		totalQty+=quantity;
		total = total + (price * quantity);
	}
	$('.badge').text(totalQty);
	document.getElementsByClassName('font-weight-bold totalPrice')[0].innerText = '$' + total;
	if(totalQty===0){
		setTimeout(function () {
			location.reload();
		},1000);
	}
}
