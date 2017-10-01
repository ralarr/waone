$(document).ready(function(){
	$('.delete-comment').on('click', function(e){
		$target = $(e.target);
		const id = $target.attr('data-id');
		$.ajax({
			type:'DELETE',
			url: '/comments/'+id,
			success: function(response){
				alert('Deleting Comment');
				window.location.href='/';
			},
			error: function(err){
				console.log(err);
			}
		});
	});
});
